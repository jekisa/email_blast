import { renderBirthdayEmail } from '../../../../../../src/lib/email'
import { buildWhatsAppClaimUrl, normalizeCampaignUrl } from '../../../../../../src/lib/campaign-url'
import { prisma } from '../../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../../src/lib/require-admin'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { templates: { where: { isActive: true }, take: 1 }, promos: { where: { isActive: true }, take: 1 }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  const template = campaign?.templates[0]
  if (!campaign || !template?.subject.trim() || !template.bodyHtml.trim()) return Response.json({ error: 'Campaign dan template aktif diperlukan untuk pratinjau.' }, { status: 409 })
  const bookingUrl = normalizeCampaignUrl(campaign.ctaUrl)
  if (!bookingUrl) return Response.json({ error: 'URL HTTPS campaign belum valid.' }, { status: 409 })
  const promo = campaign.promos[0]
  const message = renderBirthdayEmail({
    subject: template.subject,
    bodyHtml: template.bodyHtml,
    firstName: 'Nama Uji',
    promoTitle: promo?.title ?? '',
    promoDescription: promo?.description ?? '',
    promoTerms: promo?.terms ?? '',
    promoCode: promo?.codePrefix ? `${promo.codePrefix}-UJI` : '',
    bookingUrl,
    websiteUrl: bookingUrl,
    claimUrl: campaign.whatsappPhone ? buildWhatsAppClaimUrl(campaign.whatsappPhone) : null,
    imageUrl: campaign.assets[0]?.publicUrl ?? new URL('/kartu-ucapan-ulang-tahun.jpeg', request.url).toString(),
  })
  return Response.json({ subject: message.subject, html: message.html }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object' || !('subject' in input) || typeof input.subject !== 'string' || !('body' in input) || typeof input.body !== 'string') return Response.json({ error: 'Subjek dan isi pratinjau harus berupa teks.' }, { status: 400 })
  const subject = input.subject.trim()
  const body = input.body.trim()
  if (!subject || subject.length > 180 || !body || body.length > 6000) return Response.json({ error: 'Subjek harus 1–180 karakter dan isi maksimal 6.000 karakter.' }, { status: 400 })
  const campaign = await prisma.campaign.findUnique({ where: { id }, include: { promos: { where: { isActive: true }, take: 1 }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } } })
  if (!campaign) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const bookingUrl = normalizeCampaignUrl(campaign.ctaUrl)
  if (!bookingUrl) return Response.json({ error: 'URL HTTPS campaign belum valid.' }, { status: 409 })
  const message = renderBirthdayEmail({
    subject,
    bodyHtml: body.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!).replace(/\r?\n/g, '<br>'),
    firstName: 'Nama Uji',
    promoTitle: campaign.promos[0]?.title ?? '',
    promoCode: '',
    bookingUrl,
    websiteUrl: bookingUrl,
    claimUrl: campaign.whatsappPhone ? buildWhatsAppClaimUrl(campaign.whatsappPhone) : null,
    imageUrl: campaign.assets[0]?.publicUrl ?? new URL('/kartu-ucapan-ulang-tahun.jpeg', request.url).toString(),
  })
  return Response.json({ subject: message.subject, html: message.html }, { headers: { 'Cache-Control': 'no-store' } })
}
