import { renderBirthdayEmail, createSmtpTransport, emailLinkBase } from '../../../../../src/lib/email'
import { buildWhatsAppClaimUrl, normalizeCampaignUrl } from '../../../../../src/lib/campaign-url'
import { prisma } from '../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../src/lib/require-admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  if (process.env.EMAIL_SANDBOX_MODE?.trim().toLowerCase() !== 'true') return Response.json({ error: 'Kirim uji hanya tersedia saat sandbox aktif.' }, { status: 409 })
  const to = process.env.TEST_RECIPIENT?.trim().toLowerCase()
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return Response.json({ error: 'Penerima uji belum valid.' }, { status: 503 })
  const campaign = await prisma.campaign.findFirst({ orderBy: { updatedAt: 'desc' }, include: { templates: { where: { isActive: true }, take: 1 }, promos: { where: { isActive: true }, take: 1 }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } } })
  if (!campaign) return Response.json({ error: 'Buat campaign dan template sebelum mengirim preview.' }, { status: 409 })
  const bookingUrl = normalizeCampaignUrl(campaign.ctaUrl)
  if (!bookingUrl) return Response.json({ error: 'URL HTTPS campaign belum valid.' }, { status: 409 })
  const template = campaign.templates[0]
  if (!template?.subject.trim() || !template.bodyHtml.trim()) return Response.json({ error: 'Simpan subjek dan isi template sebelum mengirim preview.' }, { status: 409 })
  const promo = campaign.promos[0]
  const message = renderBirthdayEmail({ subject: template.subject, bodyHtml: template.bodyHtml, firstName: 'Nama Uji', promoTitle: promo?.title ?? '', promoCode: promo?.codePrefix ? `${promo.codePrefix}-TEST` : '', bookingUrl, websiteUrl: bookingUrl, claimUrl: campaign.whatsappPhone ? buildWhatsAppClaimUrl(campaign.whatsappPhone) : null, imageUrl: campaign.assets[0]?.publicUrl ?? new URL('/kartu-ucapan-ulang-tahun.jpeg', emailLinkBase(request.url)).toString() })
  const { transporter, from, replyTo } = createSmtpTransport()
  try {
    const sent = await transporter.sendMail({ from, to, replyTo, subject: message.subject, html: message.html, text: message.text })
    await prisma.auditLog.create({ data: { actor: session.user.id, action: 'email.test.accepted', entityType: 'email_test', details: { recipient: to, messageId: sent.messageId, providerAccepted: true } } })
    return Response.json({ status: 'accepted_by_smtp', recipient: to, messageId: sent.messageId }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    await prisma.auditLog.create({ data: { actor: session.user.id, action: 'email.test.error', entityType: 'email_test', details: { recipient: to, providerAccepted: false } } })
    return Response.json({ error: 'Server SMTP menolak atau tidak dapat menerima email uji.' }, { status: 502 })
  }
}
