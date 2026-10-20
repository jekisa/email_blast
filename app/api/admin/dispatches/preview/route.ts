import { prisma } from '../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../src/lib/require-admin'
import { buildBirthdayDispatchRows } from '../../../../../src/lib/birthday-dispatch-queue'

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object' || !('campaignId' in input) || typeof input.campaignId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.campaignId)) return Response.json({ error: 'Campaign tidak valid.' }, { status: 400 })
  const campaign = await prisma.campaign.findUnique({ where: { id: input.campaignId }, include: { promos: { where: { isActive: true }, take: 1 } } })
  if (!campaign) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  if (campaign.status !== 'active') return Response.json({ error: 'Aktifkan campaign sebelum membuat antrean.' }, { status: 409 })
  const customers = await prisma.customer.findMany({ where: { isActive: true, isBlacklisted: false }, select: { id: true, email: true, birthDate: true } })
  const rows = buildBirthdayDispatchRows(customers, [{ ...campaign, promoId: campaign.promos[0]?.id ?? null }])
  const result = await prisma.$transaction(async (tx) => {
    const inserted = rows.length ? await tx.birthdayDispatch.createMany({ data: rows, skipDuplicates: true }) : { count: 0 }
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'dispatch.queue.created', entityType: 'campaign', entityId: campaign.id, details: { queuedCount: inserted.count, excludedCount: customers.length - rows.length } } })
    return inserted.count
  })
  return Response.json({ queuedCount: result, alreadyQueuedCount: rows.length - result, excludedCount: customers.length - rows.length }, { headers: { 'Cache-Control': 'no-store' } })
}
