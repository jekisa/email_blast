import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import { renderBirthdayEmail, createSmtpTransport, emailLinkBase } from '../../../../src/lib/email'
import { normalizeCampaignUrl } from '../../../../src/lib/campaign-url'
import { birthdayMidnightJakarta, jakartaDateParts } from '../../../../src/domain'
import { prisma } from '../../../../src/lib/prisma'

export const runtime = 'nodejs'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function authorized(request: Request, secret: string) {
  const match = /^Bearer ([^\s]+)$/i.exec(request.headers.get('authorization') ?? '')
  const supplied = match?.[1] ?? ''
  const suppliedHash = createHash('sha256').update(supplied).digest()
  const expectedHash = createHash('sha256').update(secret).digest()
  return supplied.length === secret.length && timingSafeEqual(suppliedHash, expectedHash)
}

function recipientsFromEnv() {
  try {
    const value: unknown = JSON.parse(process.env.BIRTHDAY_ONE_TIME_TESTS ?? '')
    if (!Array.isArray(value) || value.length !== 4) return null
    if (!value.every((recipient): recipient is { email: string; firstName: string } => Boolean(recipient && typeof recipient === 'object'
      && 'email' in recipient && typeof recipient.email === 'string' && emailPattern.test(recipient.email.trim())
      && 'firstName' in recipient && typeof recipient.firstName === 'string' && /^[\p{L} .'-]{1,60}$/u.test(recipient.firstName.trim())))) return null
    const normalized = value.map(({ email, firstName }) => ({ email: email.trim().toLowerCase(), firstName: firstName.trim() }))
    if (new Set(normalized.map((recipient) => recipient.email)).size !== 4) return null
    return normalized
  } catch {
    return null
  }
}

function stableCustomerId(email: string) {
  const bytes = createHash('sha256').update(`birthday-email-test:${email}`).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function recipientAddress(recipient: unknown) {
  if (typeof recipient === 'string') return recipient
  return recipient && typeof recipient === 'object' && 'address' in recipient && typeof recipient.address === 'string' ? recipient.address : ''
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim() ?? ''
  if (process.env.VERCEL_ENV !== 'production' || secret.length < 32 || !authorized(request, secret)) return new Response(null, { status: 404 })

  const recipients = recipientsFromEnv()
  if (!recipients) return Response.json({ error: 'Daftar email uji harus berisi empat nama dan alamat unik.' }, { status: 503 })

  const now = new Date()
  const today = jakartaDateParts(now)
  const birthdayYear = Number(today.year)
  const testBirthDate = new Date(`${today.year}-${today.month}-${today.day}T00:00:00.000Z`)

  const campaign = await prisma.campaign.findFirst({
    where: { status: { in: ['active', 'paused'] } },
    orderBy: { updatedAt: 'desc' },
    include: { templates: { where: { isActive: true }, take: 1 }, promos: { where: { isActive: true }, take: 1 }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  const template = campaign?.templates[0]
  const bookingUrl = campaign ? normalizeCampaignUrl(campaign.ctaUrl) : null
  if (!campaign || !template?.subject.trim() || !template.bodyHtml.trim() || !bookingUrl || !campaign.whatsappPhone) {
    return Response.json({ error: 'Campaign, template, URL, atau WhatsApp belum siap.' }, { status: 503 })
  }

  let smtp: ReturnType<typeof createSmtpTransport>
  try { smtp = createSmtpTransport() } catch { return Response.json({ error: 'SMTP produksi belum dikonfigurasi.' }, { status: 503 }) }

  const customers = await Promise.all(recipients.map(async ({ email, firstName }) => {
    const id = stableCustomerId(email)
    await prisma.customer.upsert({
      where: { id },
      create: { id, email, firstName, fullName: firstName, birthDate: testBirthDate, isActive: false, source: 'birthday_email_test' },
      update: { firstName, fullName: firstName, birthDate: testBirthDate, isActive: false, source: 'birthday_email_test' },
    })
    return { id, email, firstName }
  }))
  const scheduledAt = birthdayMidnightJakarta(testBirthDate, birthdayYear)
  await prisma.birthdayDispatch.createMany({
    data: customers.map(({ id }) => ({ customerId: id, campaignId: campaign.id, promoId: campaign.promos[0]?.id ?? null, birthdayYear, scheduledAt, status: 'queued' })),
    skipDuplicates: true,
  })

  const stats = { acceptedBySmtp: 0, errors: 0, alreadyHandled: 0 }
  try {
    for (const customer of customers) {
      const claimToken = randomUUID()
      const claimed = await prisma.birthdayDispatch.updateMany({
        where: { customerId: customer.id, campaignId: campaign.id, birthdayYear, status: 'queued' },
        data: { status: 'processing', claimToken, claimedAt: new Date(), attemptCount: { increment: 1 }, updatedAt: new Date() },
      })
      if (claimed.count !== 1) { stats.alreadyHandled += 1; continue }

      const dispatch = await prisma.birthdayDispatch.findUnique({
        where: { customerId_campaignId_birthdayYear: { customerId: customer.id, campaignId: campaign.id, birthdayYear } },
      })
      if (!dispatch || dispatch.claimToken !== claimToken) { stats.alreadyHandled += 1; continue }

      const promo = campaign.promos[0]
      const prefix = promo?.codePrefix?.trim()
      const message = renderBirthdayEmail({
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        firstName: customer.firstName,
        promoTitle: promo?.title ?? '',
        promoDescription: promo?.description ?? '',
        promoTerms: promo?.terms ?? '',
        promoCode: prefix ? `${prefix}-TEST` : '',
        websiteUrl: bookingUrl,
        bookingUrl: new URL(`/api/track/${dispatch.id}`, emailLinkBase(request.url)).toString(),
        claimUrl: new URL(`/api/track/${dispatch.id}?channel=whatsapp`, emailLinkBase(request.url)).toString(),
        imageUrl: campaign.assets[0]?.publicUrl ?? new URL('/kartu-ucapan-ulang-tahun.jpeg', emailLinkBase(request.url)).toString(),
      })

      let messageId: string | null = null
      let accepted = false
      let errorType = 'SmtpSubmissionError'
      try {
        const result = await smtp.transporter.sendMail({ from: smtp.from, to: customer.email, replyTo: smtp.replyTo, subject: message.subject, html: message.html, text: message.text })
        messageId = result.messageId ?? null
        accepted = result.accepted.some((recipient) => recipientAddress(recipient).trim().toLowerCase() === customer.email)
        if (!accepted) errorType = 'SmtpRejectedRecipient'
      } catch (error) {
        if (error instanceof Error) errorType = error.name.slice(0, 80)
      }

      const status = accepted ? 'accepted' : 'error'
      const recorded = await prisma.$transaction(async (tx) => {
        const updated = await tx.birthdayDispatch.updateMany({
          where: { id: dispatch.id, status: 'processing', claimToken },
          data: { status, acceptedAt: accepted ? new Date() : null, smtpMessageId: messageId, errorMessage: accepted ? null : 'SMTP tidak mengonfirmasi penerimaan. Tidak akan dicoba ulang otomatis.', claimToken: null, updatedAt: new Date() },
        })
        if (updated.count !== 1) return false
        await tx.deliveryEvent.create({ data: { dispatchId: dispatch.id, eventType: accepted ? 'smtp_accepted' : 'send_error', smtpMessageId: messageId, details: { errorType, oneTimeTest: true, automaticRetry: false } } })
        return true
      })
      if (!recorded) stats.alreadyHandled += 1
      else if (accepted) stats.acceptedBySmtp += 1
      else stats.errors += 1
    }
  } finally {
    smtp.transporter.close()
  }

  await prisma.customer.updateMany({ where: { id: { in: customers.map(({ id }) => id) } }, data: { isActive: false } })
  return Response.json({ ...stats, recipients: customers.length }, { headers: { 'Cache-Control': 'no-store' } })
}
