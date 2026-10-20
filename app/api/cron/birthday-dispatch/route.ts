import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import { Prisma } from '../../../../src/generated/prisma/client'
import { renderBirthdayEmail, createSmtpTransport, emailLinkBase } from '../../../../src/lib/email'
import { normalizeCampaignUrl } from '../../../../src/lib/campaign-url'
import { isEligibleBirthdayRecipient } from '../../../../src/lib/birthday-recipient-eligibility'
import { birthdaysSendingOn } from '../../../../src/lib/birthday-dispatch-queue'
import { retryAfterRefusal, smtpErrorDetails, type SmtpReply } from '../../../../src/lib/smtp-error'
import { birthdaySchedule, jakartaDateParts } from '../../../../src/domain'
import { prisma } from '../../../../src/lib/prisma'

export const runtime = 'nodejs'

function safeCronAuth(request: Request, secret: string) {
  const match = /^Bearer ([^\s]+)$/i.exec(request.headers.get('authorization') ?? '')
  const supplied = match?.[1] ?? ''
  const actualHash = createHash('sha256').update(supplied).digest()
  const expectedHash = createHash('sha256').update(secret).digest()
  return supplied.length === secret.length && timingSafeEqual(actualHash, expectedHash)
}

function integerConfig(name: string, fallback: number, min: number, max: number) {
  const raw = process.env[name]
  if (!raw) return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} tidak valid.`)
  return value
}

function dateAtOffset(birthday: Date, year: number, days: number) {
  const month = birthday.getUTCMonth()
  const originalDay = birthday.getUTCDate()
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const day = month === 1 && originalDay === 29 && !leap ? 28 : originalDay
  return new Date(Date.UTC(year, month, day + days))
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('id-ID', { timeZone, dateStyle: 'long' }).format(date)
}

function recipientAddress(recipient: unknown) {
  if (typeof recipient === 'string') return recipient
  if (recipient && typeof recipient === 'object' && 'address' in recipient && typeof recipient.address === 'string') return recipient.address
  return ''
}

const maxSendAttempts = 3
const retryDelayMs = 15 * 60_000

async function pause(ms: number) {
  if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms))
}

async function queueTodaysBirthdays(now: Date) {
  const today = jakartaDateParts(now)
  const todayDate = `${today.year}-${today.month}-${today.day}`
  const campaigns = await prisma.campaign.findMany({ where: { status: 'active' }, select: { id: true, sendOffsetDays: true, sendTime: true } })
  if (!campaigns.length) return { candidates: 0, created: 0 }
  const birthdays = birthdaysSendingOn(todayDate, campaigns.map((campaign) => campaign.sendOffsetDays))
  const customers = await prisma.$queryRaw<Array<{ id: string; email: string; birth_date: Date }>>(Prisma.sql`
    SELECT id, email, birth_date FROM customers
    WHERE is_active = true AND is_blacklisted = false
      AND (EXTRACT(MONTH FROM birth_date)::int, EXTRACT(DAY FROM birth_date)::int) IN (${Prisma.join(birthdays.map(([month, day]) => Prisma.sql`(${month}::int, ${day}::int)`))})
  `)
  const rows = customers.flatMap((customer) => campaigns.flatMap((campaign) => {
    const email = customer.email.trim()
    if (!isEligibleBirthdayRecipient(email, true, false)) return []
    const schedule = birthdaySchedule(customer.birth_date.toISOString().slice(0, 10), campaign.sendOffsetDays, now)
    if (!schedule || schedule.date !== todayDate) return []
    const sendTime = campaign.sendTime.toISOString().slice(11, 16)
    const scheduledAt = new Date(`${schedule.date}T${sendTime}:00+07:00`)
    return [{ customerId: customer.id, campaignId: campaign.id, birthdayYear: schedule.birthdayYear, scheduledAt }]
  }))
  const created = rows.length ? await prisma.birthdayDispatch.createMany({ data: rows, skipDuplicates: true }) : { count: 0 }
  return { candidates: customers.length, created: created.count }
}

async function dispatchBirthdays(request: Request) {
  const startedAt = Date.now()
  const secret = process.env.CRON_SECRET?.trim() ?? ''
  if (process.env.VERCEL_ENV !== 'production'
    || process.env.CUSTOMER_SENDS_ENABLED?.trim().toLowerCase() !== 'true'
    || process.env.EMAIL_SANDBOX_MODE?.trim().toLowerCase() !== 'false'
    || secret.length < 32
    || !safeCronAuth(request, secret)) return new Response(null, { status: 404 })

  const timeZone = process.env.APP_TIMEZONE?.trim() || 'Asia/Jakarta'
  try {
    new Intl.DateTimeFormat('en', { timeZone })
  } catch {
    return Response.json({ error: 'Zona waktu kampanye belum dikonfigurasi dengan aman.' }, { status: 503 })
  }
  if (process.env.FEB_29_POLICY !== 'SEND_FEB_28') return Response.json({ error: 'Kebijakan ulang tahun 29 Februari belum valid.' }, { status: 503 })

  let batchSize: number
  let delayMs: number
  let runBudgetMs: number
  let hourlyLimit: number
  try {
    batchSize = integerConfig('EMAIL_BATCH_SIZE', 50, 1, 100)
    delayMs = integerConfig('EMAIL_BATCH_DELAY_MS', 1000, 0, 60_000)
    runBudgetMs = integerConfig('EMAIL_RUN_BUDGET_MS', 18_000, 1_000, 120_000)
    hourlyLimit = integerConfig('EMAIL_HOURLY_LIMIT', 100, 1, 10_000)
  } catch {
    return Response.json({ error: 'Batas pengiriman kampanye belum valid.' }, { status: 503 })
  }

  const now = new Date()
  const queued = await queueTodaysBirthdays(now)
  // Hosting quota is 400/h; stay under the cap and leave the rest queued for the next window.
  const sentLastHour = await prisma.deliveryEvent.count({ where: { eventType: 'smtp_accepted', occurredAt: { gt: new Date(now.getTime() - 3_600_000) } } })
  // After a refusal (16 Oct: "550 classified as SPAM" by the provider's outbound filter) pause everything until
  // the retry time (06:00 WIB for night refusals), so the queue does not keep hitting the filter.
  const lastRefusal = await prisma.deliveryEvent.findFirst({ where: { eventType: 'smtp_rejected', occurredAt: { gt: new Date(now.getTime() - 7 * 3_600_000) } }, orderBy: { occurredAt: 'desc' }, select: { occurredAt: true } })
  const refusedRecently = lastRefusal && now < retryAfterRefusal(lastRefusal.occurredAt, retryDelayMs) ? 1 : 0
  const allowance = refusedRecently ? 0 : Math.min(batchSize, hourlyLimit - sentLastHour)
  const candidates = allowance > 0 ? await prisma.birthdayDispatch.findMany({
    where: { status: 'queued', scheduledAt: { lte: now }, campaign: { status: 'active' } },
    orderBy: [{ scheduledAt: 'asc' }, { id: 'asc' }], take: allowance, select: { id: true },
  }) : []
  if (!candidates.length) return Response.json({ prepared: queued.created, claimed: 0, acceptedBySmtp: 0, rejectedBySmtp: 0, errors: 0, cancelled: 0, sentLastHour, pausedAfterRefusal: refusedRecently > 0 })

  let smtpTransport: ReturnType<typeof createSmtpTransport>
  try { smtpTransport = createSmtpTransport() } catch { return Response.json({ error: 'SMTP produksi belum dikonfigurasi.' }, { status: 503 }) }
  const stats = { claimed: 0, acceptedBySmtp: 0, rejectedBySmtp: 0, errors: 0, cancelled: 0 }

  try {
    for (const candidate of candidates) {
      // Stop claiming once the run budget is spent so the cron caller (30 s timeout) gets an answer
      // and no row is left in processing; the next minute picks up the rest.
      if (Date.now() - startedAt > runBudgetMs) break
      const claimToken = randomUUID()
      const claimed = await prisma.birthdayDispatch.updateMany({
        where: { id: candidate.id, status: 'queued', scheduledAt: { lte: now }, campaign: { status: 'active' } },
        data: { status: 'processing', claimToken, claimedAt: new Date(), attemptCount: { increment: 1 }, updatedAt: new Date() },
      })
      if (claimed.count !== 1) continue
      stats.claimed += 1

      const dispatch = await prisma.birthdayDispatch.findUnique({
        where: { id: candidate.id },
        include: {
          customer: true,
          campaign: { include: { templates: { where: { isActive: true }, take: 1 }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } } },
          promo: true,
        },
      })
      if (!dispatch || dispatch.claimToken !== claimToken) continue

      const email = dispatch.customer.email.trim()
      const normalizedEmail = email.toLocaleLowerCase()
      const template = dispatch.campaign.templates[0]
      const bookingUrl = normalizeCampaignUrl(dispatch.campaign.ctaUrl)
      let cancelled = false
      let error = 'Campaign, kontak, atau template tidak lagi memenuhi syarat pengiriman.'
      if (!isEligibleBirthdayRecipient(email, dispatch.customer.isActive, dispatch.customer.isBlacklisted)
        || dispatch.campaign.status !== 'active'
        || !template?.subject.trim() || !template.bodyHtml.trim() || !bookingUrl) {
        cancelled = true
        if (!bookingUrl) error = 'URL HTTPS CTA campaign tidak valid.'
      }
      // One birthday email per customer per year, even if the active campaign was switched.
      if (!cancelled && await prisma.birthdayDispatch.count({ where: { customerId: dispatch.customerId, birthdayYear: dispatch.birthdayYear, id: { not: dispatch.id }, status: { in: ['accepted', 'processing'] } } })) {
        cancelled = true
        error = 'Sudah menerima email ulang tahun tahun ini dari campaign lain.'
      }

      let accepted = false
      let rejected = false
      let messageId: string | undefined
      let errorType = 'SmtpSubmissionError'
      let smtpReply: SmtpReply = {}
      if (!cancelled) {
        const promo = dispatch.promo
        const validFrom = promo ? dateAtOffset(dispatch.customer.birthDate, dispatch.birthdayYear, -promo.validDaysBeforeBirthday) : undefined
        const validUntil = promo ? dateAtOffset(dispatch.customer.birthDate, dispatch.birthdayYear, promo.validDaysAfterBirthday) : undefined
        const code = promo?.codePrefix ? `${promo.codePrefix}-${dispatch.birthdayYear}-${dispatch.id.slice(0, 6).toUpperCase()}` : ''
        const trackedUrl = new URL(`/api/track/${dispatch.id}`, emailLinkBase(request.url)).toString()
        const trackedWhatsAppUrl = dispatch.campaign.whatsappPhone
          ? new URL(`/api/track/${dispatch.id}?channel=whatsapp`, emailLinkBase(request.url)).toString()
          : null
        const message = renderBirthdayEmail({
          subject: template!.subject,
          bodyHtml: template!.bodyHtml,
          firstName: dispatch.customer.firstName?.trim() || dispatch.customer.fullName?.trim() || 'Sahabat Sanghyang',
          promoTitle: promo?.title ?? '',
          promoDescription: promo?.description ?? '',
          promoTerms: promo?.terms ?? '',
          promoCode: code,
          promoValidFrom: validFrom ? formatDate(validFrom, timeZone) : '',
          promoValidUntil: validUntil ? formatDate(validUntil, timeZone) : '',
          bookingUrl: trackedUrl,
          websiteUrl: bookingUrl!,
          claimUrl: trackedWhatsAppUrl,
          imageUrl: dispatch.campaign.assets[0]?.publicUrl ?? new URL('/kartu-ucapan-ulang-tahun.jpeg', emailLinkBase(request.url)).toString(),
        })
        try {
          const result = await smtpTransport.transporter.sendMail({ from: smtpTransport.from, to: email, replyTo: smtpTransport.replyTo, subject: message.subject, html: message.html, text: message.text })
          messageId = result.messageId
          accepted = result.accepted.some((recipient) => recipientAddress(recipient).toLocaleLowerCase() === normalizedEmail)
          rejected = !accepted
          if (rejected) errorType = 'SmtpRejectedRecipient'
        } catch (sendError) {
          if (sendError instanceof Error) errorType = sendError.name.slice(0, 80)
          smtpReply = smtpErrorDetails(sendError)
          // A numeric reply means the server answered and refused the mail, so it was not delivered.
          if (smtpReply.responseCode && smtpReply.responseCode >= 400) rejected = true
        }
      }

      // An explicit refusal (e.g. the throttle that hit after 58 sends on 15 Oct) means nothing was delivered,
      // so try again later on its own instead of waiting for an admin. Connection drops stay manual.
      const retryLater = rejected && (smtpReply.responseCode ?? 0) >= 400 && dispatch.attemptCount < maxSendAttempts
      const finalStatus = retryLater ? 'queued' : cancelled ? 'cancelled' : accepted ? 'accepted' : rejected ? 'rejected' : 'error'
      const finalError = finalStatus === 'accepted' ? null
        : cancelled ? error
        : smtpReply.responseCode ? `Server email menolak (${smtpReply.responseCode}): ${smtpReply.response ?? ''}`.slice(0, 500)
        : rejected ? 'Server email menolak alamat penerima.'
        : `SMTP tidak mengonfirmasi penerimaan${smtpReply.code ? ` (${smtpReply.code})` : ''}. Hasil dapat ambigu; perlu pemeriksaan manual dan tidak akan dicoba ulang otomatis.`
      await prisma.$transaction(async (tx) => {
        const updated = await tx.birthdayDispatch.updateMany({
          where: { id: dispatch.id, status: 'processing', claimToken },
          data: { status: finalStatus, acceptedAt: accepted ? new Date() : null, smtpMessageId: messageId ?? null, errorMessage: finalError, claimToken: null, updatedAt: new Date(), ...(retryLater ? { scheduledAt: retryAfterRefusal(new Date(), retryDelayMs) } : {}) },
        })
        if (updated.count !== 1 || finalStatus === 'cancelled') return
        await tx.deliveryEvent.create({ data: {
          dispatchId: dispatch.id,
          eventType: accepted ? 'smtp_accepted' : rejected ? 'smtp_rejected' : 'send_error',
          smtpMessageId: messageId,
          details: { errorType, ...smtpReply, automaticRetry: retryLater },
        } })
      })
      if (accepted) stats.acceptedBySmtp += 1
      else if (rejected) stats.rejectedBySmtp += 1
      else if (cancelled) stats.cancelled += 1
      else stats.errors += 1
      // A thrown SMTP error (quota, outage, timeout) usually repeats for the next mail too; stop this run
      // so it costs one row per minute instead of the whole batch.
      if (smtpReply.code || smtpReply.responseCode) break
      await pause(delayMs)
    }
  } finally {
    smtpTransport.transporter.close()
  }

  return Response.json({ prepared: queued.created, ...stats }, { headers: { 'Cache-Control': 'no-store' } })
}

export const GET = dispatchBirthdays
export const POST = dispatchBirthdays
