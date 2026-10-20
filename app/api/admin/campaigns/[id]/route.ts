import { prisma } from '../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../src/lib/require-admin'
import { normalizeCampaignUrl, normalizeWhatsAppPhone } from '../../../../../src/lib/campaign-url'

const validStatuses = new Set(['draft', 'active', 'paused', 'ended'])

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object') return Response.json({ error: 'Perubahan campaign tidak valid.' }, { status: 400 })
  const data: { name?: string; status?: string; sendOffsetDays?: number; sendTime?: Date; ctaUrl?: string; whatsappPhone?: string | null; whatsappPhone2?: string | null; whatsappContactName?: string | null; whatsappContactName2?: string | null } = {}
  if ('name' in input) {
    if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 100) return Response.json({ error: 'Nama campaign harus 1–100 karakter.' }, { status: 400 })
    data.name = input.name.trim()
  }
  if ('status' in input) {
    if (typeof input.status !== 'string' || !validStatuses.has(input.status)) return Response.json({ error: 'Status campaign tidak valid.' }, { status: 400 })
    data.status = input.status
  }
  if ('sendOffsetDays' in input) {
    if (typeof input.sendOffsetDays !== 'number' || !Number.isInteger(input.sendOffsetDays) || input.sendOffsetDays < -7 || input.sendOffsetDays > 0) return Response.json({ error: 'Jadwal harus antara H-7 sampai H-0.' }, { status: 400 })
    data.sendOffsetDays = input.sendOffsetDays
  }
  if ('ctaUrl' in input) {
    const ctaUrl = typeof input.ctaUrl === 'string' ? normalizeCampaignUrl(input.ctaUrl) : null
    if (!ctaUrl) return Response.json({ error: 'URL tujuan harus HTTPS yang valid, tanpa username atau password.' }, { status: 400 })
    data.ctaUrl = ctaUrl
  }
  if ('whatsappPhone' in input) {
    if (input.whatsappPhone === null || (typeof input.whatsappPhone === 'string' && !input.whatsappPhone.trim())) data.whatsappPhone = null
    else {
      const phone = typeof input.whatsappPhone === 'string' ? normalizeWhatsAppPhone(input.whatsappPhone) : null
      if (!phone) return Response.json({ error: 'Nomor WhatsApp harus format internasional, contoh +6281234567890.' }, { status: 400 })
      data.whatsappPhone = phone
    }
    // One WhatsApp number per campaign; clear the retired second contact and names.
    data.whatsappPhone2 = null
    data.whatsappContactName = null
    data.whatsappContactName2 = null
  }
  const updated = await prisma.$transaction(async (tx) => {
    if (data.status === 'active') {
      const template = await tx.campaignTemplateVersion.findFirst({ where: { campaignId: id, isActive: true }, select: { subject: true, bodyHtml: true } })
      if (!template?.subject.trim() || !template.bodyHtml.trim()) return 'template-required' as const
      const campaign = await tx.campaign.findUnique({ where: { id }, select: { ctaUrl: true, whatsappPhone: true } })
      if (!campaign || !normalizeCampaignUrl(campaign.ctaUrl)) return 'cta-invalid' as const
      // Sends always start at 00:00 Asia/Jakarta; the day (H-0 to H-7) stays as chosen.
      data.sendTime = new Date('1970-01-01T00:00:00.000Z')
      if (!(data.whatsappPhone ?? campaign.whatsappPhone)) return 'whatsapp-required' as const
      // Only one campaign may be active; the admin confirms pausing the current one.
      const others = await tx.campaign.findMany({ where: { status: 'active', id: { not: id } }, select: { id: true, name: true } })
      if (others.length && !('replaceActive' in input && input.replaceActive === true)) return { kind: 'other-active' as const, names: others.map((other) => other.name) }
      if (others.length) {
        await tx.campaign.updateMany({ where: { id: { in: others.map((other) => other.id) } }, data: { status: 'paused' } })
        await tx.auditLog.createMany({ data: others.map((other) => ({ actor: session.user.id, action: 'campaign.paused_for_replacement', entityType: 'campaign', entityId: other.id, details: { replacedBy: id } })) })
      }
    }
    const campaign = await tx.campaign.update({ where: { id }, data })
    if (data.status === 'active' || 'sendOffsetDays' in data) {
      await tx.$executeRaw`
        WITH recalculated AS (
          SELECT d.id,
            (make_date(
              d.birthday_year,
              EXTRACT(MONTH FROM customer.birth_date)::int,
              CASE WHEN EXTRACT(MONTH FROM customer.birth_date) = 2 AND EXTRACT(DAY FROM customer.birth_date) = 29
                AND NOT (d.birthday_year % 4 = 0 AND (d.birthday_year % 100 <> 0 OR d.birthday_year % 400 = 0))
                THEN 28 ELSE EXTRACT(DAY FROM customer.birth_date)::int END
            ) + campaign.send_offset_days + campaign.send_time) AT TIME ZONE 'Asia/Jakarta' AS scheduled_at
          FROM birthday_dispatches d
          JOIN customers customer ON customer.id = d.customer_id
          JOIN campaigns campaign ON campaign.id = d.campaign_id
          WHERE d.campaign_id = ${id}::uuid AND d.status = 'queued'
        )
        UPDATE birthday_dispatches d
        SET scheduled_at = recalculated.scheduled_at,
            status = CASE WHEN recalculated.scheduled_at < NOW() THEN 'cancelled' ELSE 'queued' END,
            updated_at = NOW()
        FROM recalculated WHERE d.id = recalculated.id
      `
    }
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.updated', entityType: 'campaign', entityId: id, details: { fields: Object.keys(data) } } })
    return { kind: 'updated' as const, campaign }
  }).catch((error: unknown) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') return null
    throw error
  })
  if (updated === 'template-required') return Response.json({ error: 'Simpan subjek dan isi template sebelum campaign diaktifkan.' }, { status: 409 })
  if (updated === 'cta-invalid') return Response.json({ error: 'URL Sanghyang campaign tidak valid.' }, { status: 409 })
  if (updated === 'whatsapp-required') return Response.json({ error: 'Simpan nomor WhatsApp sebelum mengaktifkan campaign.' }, { status: 409 })
  if (!updated) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  if (updated.kind === 'other-active') return Response.json({ error: `${updated.names.join(', ')} sedang aktif. Muat ulang halaman lalu aktifkan lagi untuk menjedanya.` }, { status: 409 })
  return Response.json({ campaign: updated.campaign }, { headers: { 'Cache-Control': 'no-store' } })
}
