import { createHash } from 'node:crypto'
import { jakartaDateParts, normalizeName, normalizePhone } from '../../../../src/domain'
import { prisma } from '../../../../src/lib/prisma'
import { requireAdmin } from '../../../../src/lib/require-admin'
import { buildBirthdayDispatchRows } from '../../../../src/lib/birthday-dispatch-queue'
import { ageOn, correctBirthdayEmail, isUsableBirthdayEmail, maxBirthdayAge } from '../../../../src/lib/birthday-recipient-eligibility'

export const runtime = 'nodejs'
type Row = { selected?: unknown; rawEmail?: unknown; birthDate?: unknown; fullName?: unknown; recordNumber?: unknown; phone?: unknown; city?: unknown; countryCode?: unknown }
const text = (value: unknown, max: number) => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null)
function isRecord(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value) }

function contactKey(contact: { email: string; fullName: string | null; birthDate: Date | string }) {
  const birthDate = contact.birthDate instanceof Date ? contact.birthDate.toISOString().slice(0, 10) : contact.birthDate.slice(0, 10)
  return `${contact.email.trim().toLocaleLowerCase()}|${contact.fullName?.trim().toLocaleLowerCase() ?? ''}|${birthDate}`
}

function findDuplicateRows(accepted: { email: string; fullName: string | null; birthDate: Date; recordNumber: number | null }[], inserted: { email: string; fullName: string | null; birthDate: Date }[]) {
  const insertedCounts = new Map<string, number>()
  for (const contact of inserted) {
    const key = contactKey(contact)
    insertedCounts.set(key, (insertedCounts.get(key) ?? 0) + 1)
  }
  return accepted.flatMap((row) => {
    const key = contactKey(row)
    const count = insertedCounts.get(key) ?? 0
    if (count) { insertedCounts.set(key, count - 1); return [] }
    return [{ fullName: row.fullName, email: row.email, birthDate: row.birthDate.toISOString().slice(0, 10), recordNumber: row.recordNumber }]
  })
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 10 * 1024 * 1024) return Response.json({ error: 'Payload impor maksimal 10 MB.' }, { status: 413 })
  const body: unknown = await request.json().catch(() => null)
  if (!isRecord(body) || !Array.isArray(body.rows)) {
    return Response.json({ error: 'File dan baris impor tidak valid.' }, { status: 400 })
  }
  if (body.rows.length > 5000) return Response.json({ error: 'Maksimal 5.000 baris per impor.' }, { status: 413 })
  const rows = (body.rows as Row[]).filter((row) => row?.selected === true)
  const today = jakartaDateParts()
  const todayIso = `${today.year}-${today.month}-${today.day}`
  const accepted = rows.flatMap((row) => {
    const email = typeof row.rawEmail === 'string' ? correctBirthdayEmail(row.rawEmail) : ''
    const birthDate = typeof row.birthDate === 'string' ? row.birthDate : ''
    const name = typeof row.fullName === 'string' ? normalizeName(row.fullName).fullName : ''
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDate) && !Number.isNaN(Date.parse(`${birthDate}T00:00:00.000Z`)) && new Date(`${birthDate}T00:00:00.000Z`).toISOString().slice(0, 10) === birthDate
    if (!isUsableBirthdayEmail(email) || !validDate) return []
    const phone = typeof row.phone === 'string' ? normalizePhone(row.phone) || null : null
    const countryCode = text(row.countryCode, 3)
    return [{ email, fullName: name || null, firstName: name.split(/\s+/)[0] || null, birthDate: new Date(`${birthDate}T00:00:00.000Z`), phone, city: text(row.city, 80), countryCode: countryCode && /^[A-Z]{2,3}$/.test(countryCode) ? countryCode : null, isActive: ageOn(birthDate, todayIso) < maxBirthdayAge, recordNumber: typeof row.recordNumber === 'number' && Number.isSafeInteger(row.recordNumber) ? row.recordNumber : null }]
  })
  if (!accepted.length) return Response.json({ error: 'Tidak ada kontak terpilih dengan email valid dan tanggal lahir valid.' }, { status: 400 })
  const fileHash = createHash('sha256').update(JSON.stringify(rows)).digest('hex')

  try {
    const existingBatch = await prisma.importBatch.findUnique({ where: { fileHash } })
    if (existingBatch) {
      const inserted = await prisma.customer.findMany({ where: { importBatchId: existingBatch.id }, select: { email: true, fullName: true, birthDate: true } })
      const duplicates = findDuplicateRows(accepted, inserted)
      return Response.json({ batch: existingBatch, alreadyProcessed: true, duplicates }, { headers: { 'Cache-Control': 'no-store' } })
    }
    const result = await prisma.$transaction(async (tx) => {
      const createdBatch = await tx.importBatch.create({ data: {
        fileName: typeof body.fileName === 'string' ? body.fileName.split(/[\\/]/).pop()!.slice(0, 200) : 'import',
        fileHash, importedCount: 0, rejectedCount: rows.length - accepted.length,
      } })
      const inserted = await tx.customer.createMany({
        data: accepted.map(({ recordNumber: _recordNumber, ...row }) => ({ ...row, source: 'import', importBatchId: createdBatch.id })),
        skipDuplicates: true,
      })
      const insertedRows = await tx.customer.findMany({ where: { importBatchId: createdBatch.id }, select: { id: true, email: true, fullName: true, birthDate: true, isActive: true } })
      const inactiveByAge = insertedRows.filter((row) => !row.isActive).length
      const duplicates = findDuplicateRows(accepted, insertedRows)
      const rejectedCount = rows.length - inserted.count
      const campaigns = await tx.campaign.findMany({ where: { status: 'active' }, include: { promos: { where: { isActive: true }, take: 1 } } })
      const dispatchRows = buildBirthdayDispatchRows(insertedRows.filter((row) => row.isActive), campaigns.map((campaign) => ({ ...campaign, promoId: campaign.promos[0]?.id ?? null })))
      const queuedCount = dispatchRows.length ? (await tx.birthdayDispatch.createMany({ data: dispatchRows, skipDuplicates: true })).count : 0
      const updated = await tx.importBatch.update({ where: { id: createdBatch.id }, data: { importedCount: inserted.count, rejectedCount } })
      await tx.auditLog.create({ data: { actor: session.user.id, action: 'customer.imported', entityType: 'import_batch', entityId: updated.id, details: { importedCount: inserted.count, rejectedCount, queuedCount, inactiveByAge } } })
      return { batch: updated, duplicates, queuedCount, inactiveByAge }
    })
    return Response.json({ ...result, alreadyProcessed: false }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const existingBatch = await prisma.importBatch.findUnique({ where: { fileHash } })
      if (existingBatch) {
        const inserted = await prisma.customer.findMany({ where: { importBatchId: existingBatch.id }, select: { email: true, fullName: true, birthDate: true } })
        const duplicates = findDuplicateRows(accepted, inserted)
        return Response.json({ batch: existingBatch, alreadyProcessed: true, duplicates }, { headers: { 'Cache-Control': 'no-store' } })
      }
    }
    throw error
  }
}
