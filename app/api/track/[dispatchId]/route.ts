import { buildWhatsAppClaimUrl, normalizeCampaignUrl } from '../../../../src/lib/campaign-url'
import { prisma } from '../../../../src/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ dispatchId: string }> }) {
  const { dispatchId } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(dispatchId)) return new Response(null, { status: 404 })
  const channel = new URL(request.url).searchParams.get('channel') ?? 'sanghyang'
  if (channel !== 'sanghyang' && channel !== 'whatsapp') return new Response(null, { status: 404 })
  const dispatch = await prisma.birthdayDispatch.findUnique({
    where: { id: dispatchId },
    select: { status: true, campaign: { select: { ctaUrl: true, whatsappPhone: true } } },
  })
  const destination = dispatch?.status === 'accepted'
    ? channel === 'whatsapp'
      ? dispatch.campaign.whatsappPhone ? buildWhatsAppClaimUrl(dispatch.campaign.whatsappPhone) : null
      : normalizeCampaignUrl(dispatch.campaign.ctaUrl)
    : null
  if (!destination) return new Response(null, { status: 404 })

  try {
    const eventType = channel === 'whatsapp' ? 'whatsapp_clicked' : 'link_clicked'
    const existingClick = await prisma.deliveryEvent.findFirst({ where: { dispatchId, eventType }, select: { id: true } })
    if (!existingClick) await prisma.deliveryEvent.create({ data: { dispatchId, eventType, details: {} } })
  } catch {
    // Keep the destination usable if event storage is temporarily unavailable.
  }
  return new Response(null, { status: 302, headers: { Location: destination, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } })
}
