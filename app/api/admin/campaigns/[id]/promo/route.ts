import { prisma } from '../../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../../src/lib/require-admin'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object') return Response.json({ error: 'Data promo tidak valid.' }, { status: 400 })
  const values = input as Record<string, unknown>
  const { title: rawTitle, description, terms } = values
  if (typeof rawTitle !== 'string' || typeof description !== 'string' || typeof terms !== 'string') return Response.json({ error: 'Data promo tidak valid.' }, { status: 400 })
  const title = rawTitle.trim()
  if (!title || title.length > 120 || description.length > 2000 || terms.length > 2000) return Response.json({ error: 'Periksa panjang judul, deskripsi, dan syarat promo.' }, { status: 400 })
  const before = values.validDaysBeforeBirthday ?? 1
  const after = values.validDaysAfterBirthday ?? 7
  if (typeof before !== 'number' || !Number.isInteger(before) || before < 0 || before > 30 || typeof after !== 'number' || !Number.isInteger(after) || after < 0 || after > 60) return Response.json({ error: 'Masa berlaku promo tidak valid.' }, { status: 400 })
  const codePrefix = typeof values.codePrefix === 'string' ? values.codePrefix.trim().slice(0, 24) || null : null
  const promo = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.findUnique({ where: { id }, select: { id: true } })
    if (!campaign) return null
    await tx.promo.updateMany({ where: { campaignId: id, isActive: true }, data: { isActive: false } })
    const created = await tx.promo.create({ data: { campaignId: id, title, description: description.trim(), terms: terms.trim(), codePrefix, validDaysBeforeBirthday: before, validDaysAfterBirthday: after } })
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.promo.created', entityType: 'promo', entityId: created.id, details: { campaignId: id, validDaysBeforeBirthday: before, validDaysAfterBirthday: after } } })
    return created
  })
  if (!promo) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  return Response.json({ promo }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
