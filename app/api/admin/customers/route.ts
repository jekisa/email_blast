import { prisma } from '../../../../src/lib/prisma'
import { requireAdmin } from '../../../../src/lib/require-admin'
import { buildBirthdayDispatchRows } from '../../../../src/lib/birthday-dispatch-queue'

export const runtime = 'nodejs'

// Sortable columns of the contact list; age sorts by birth date in the opposite direction.
const sortFields = { name: 'fullName', birthDate: 'birthDate', age: 'birthDate', email: 'email', city: 'city', status: 'isBlacklisted', createdAt: 'createdAt' } as const

export async function GET(request: Request) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const url = new URL(request.url)
  const page = Math.max(1, Math.min(10_000, Number(url.searchParams.get('page')) || 1))
  const pageSize = Math.max(1, Math.min(100, Number(url.searchParams.get('pageSize')) || 50))
  const query = url.searchParams.get('q')?.trim().slice(0, 120) ?? ''
  // Phones are stored as +62…; "0812 345" finds them by the digits after the leading 0 or 62.
  const phoneDigits = query.replace(/\D/g, '').replace(/^(0|62)/, '')
  const where = query ? { OR: [
    { fullName: { contains: query, mode: 'insensitive' as const } },
    { email: { contains: query, mode: 'insensitive' as const } },
    { city: { contains: query, mode: 'insensitive' as const } },
    ...(phoneDigits.length >= 4 ? [{ phone: { contains: phoneDigits } }] : []),
  ] } : {}
  const sort = url.searchParams.get('sort') ?? 'name'
  const field = sortFields[sort as keyof typeof sortFields] ?? 'fullName'
  const ascending = url.searchParams.get('dir') === 'asc'
  const direction = (sort === 'age' ? !ascending : ascending) ? 'asc' as const : 'desc' as const
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy: [{ [field]: field === 'fullName' || field === 'city' ? { sort: direction, nulls: 'last' } : direction }, { id: 'asc' }], skip: (page - 1) * pageSize, take: pageSize }),
    prisma.customer.count({ where }),
  ])
  return Response.json({ customers, page, pageSize, total }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PATCH(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object' || !('id' in input) || typeof input.id !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)
    || !('isBlacklisted' in input) || typeof input.isBlacklisted !== 'boolean') return Response.json({ error: 'Perubahan kontak tidak valid.' }, { status: 400 })
  const { id, isBlacklisted } = input as { id: string; isBlacklisted: boolean }
  const customer = await prisma.$transaction(async (tx) => {
    const updated = await tx.customer.update({ where: { id }, data: { isBlacklisted } })
    const campaigns = !isBlacklisted && updated.isActive
      ? await tx.campaign.findMany({ where: { status: 'active' }, include: { promos: { where: { isActive: true }, take: 1 } } })
      : []
    const dispatchRows = buildBirthdayDispatchRows([updated], campaigns.map((campaign) => ({ ...campaign, promoId: campaign.promos[0]?.id ?? null })))
    const queuedCount = dispatchRows.length ? (await tx.birthdayDispatch.createMany({ data: dispatchRows, skipDuplicates: true })).count : 0
    await tx.auditLog.create({ data: { actor: session.user.id, action: isBlacklisted ? 'customer.blacklisted' : 'customer.unblacklisted', entityType: 'customer', entityId: updated.id, details: { queuedCount } } })
    return { customer: updated, queuedCount }
  }).catch((error: unknown) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') return null
    throw error
  })
  if (!customer) return Response.json({ error: 'Kontak tidak ditemukan.' }, { status: 404 })
  return Response.json(customer, { headers: { 'Cache-Control': 'no-store' } })
}
