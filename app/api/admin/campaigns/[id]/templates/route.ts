import { prisma } from '../../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../../src/lib/require-admin'

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Optional version label: undefined when absent, null when cleared, an error string when invalid.
function versionName(input: object): string | null | undefined | Error {
  if (!('name' in input) || input.name === undefined) return undefined
  if (input.name === null || (typeof input.name === 'string' && !input.name.trim())) return null
  if (typeof input.name !== 'string' || input.name.trim().length > 60) return new Error('Nama versi maksimal 60 karakter.')
  return input.name.trim()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const templates = await prisma.campaignTemplateVersion.findMany({ where: { campaignId: id }, orderBy: { version: 'desc' } })
  return Response.json({ templates }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object' || !('subject' in input) || typeof input.subject !== 'string' || !('body' in input) || typeof input.body !== 'string') return Response.json({ error: 'Subjek dan isi email wajib berupa teks.' }, { status: 400 })
  const subject = input.subject.trim()
  const body = input.body.trim()
  if (!subject || subject.length > 180 || !body || body.length > 6000) return Response.json({ error: 'Subjek harus 1–180 karakter dan isi maksimal 6.000 karakter.' }, { status: 400 })
  const name = versionName(input)
  if (name instanceof Error) return Response.json({ error: name.message }, { status: 400 })
  const created = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.findUnique({ where: { id }, select: { id: true } })
    if (!campaign) return null
    await tx.campaignTemplateVersion.updateMany({ where: { campaignId: id, isActive: true }, data: { isActive: false } })
    const latest = await tx.campaignTemplateVersion.aggregate({ where: { campaignId: id }, _max: { version: true } })
    const template = await tx.campaignTemplateVersion.create({ data: { campaignId: id, version: (latest._max.version ?? 0) + 1, name: name ?? null, subject, bodyHtml: escapeHtml(body).replace(/\r?\n/g, '<br>'), isActive: true } })
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.template.version.created', entityType: 'campaign', entityId: id, details: { version: template.version } } })
    return template
  })
  if (!created) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  return Response.json({ template: created }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  const version = Number(new URL(request.url).searchParams.get('version'))
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  if (!Number.isSafeInteger(version) || version < 1) return Response.json({ error: 'Versi template tidak valid.' }, { status: 400 })

  const deleted = await prisma.$transaction(async (tx) => {
    const template = await tx.campaignTemplateVersion.findFirst({ where: { campaignId: id, version } })
    if (!template) return null
    await tx.campaignTemplateVersion.delete({ where: { id: template.id } })
    let replacementVersion: number | null = null
    if (template.isActive) {
      const replacement = await tx.campaignTemplateVersion.findFirst({ where: { campaignId: id }, orderBy: { version: 'desc' } })
      if (replacement) {
        await tx.campaignTemplateVersion.update({ where: { id: replacement.id }, data: { isActive: true } })
        replacementVersion = replacement.version
      }
    }
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.template.version.deleted', entityType: 'campaign', entityId: id, details: { version, replacementVersion } } })
    return { version, replacementVersion }
  })
  if (!deleted) return Response.json({ error: 'Template tidak ditemukan.' }, { status: 404 })
  return Response.json({ deleted }, { headers: { 'Cache-Control': 'no-store' } })
}

// Rename a saved version, or make it the active template without creating a copy.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  const version = Number(new URL(request.url).searchParams.get('version'))
  if (!uuidPattern.test(id)) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })
  if (!Number.isSafeInteger(version) || version < 1) return Response.json({ error: 'Versi template tidak valid.' }, { status: 400 })
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object') return Response.json({ error: 'Perubahan versi tidak valid.' }, { status: 400 })
  const name = versionName(input)
  if (name instanceof Error) return Response.json({ error: name.message }, { status: 400 })
  const activate = 'isActive' in input && input.isActive === true
  if (name === undefined && !activate) return Response.json({ error: 'Tidak ada perubahan versi.' }, { status: 400 })

  const updated = await prisma.$transaction(async (tx) => {
    const template = await tx.campaignTemplateVersion.findFirst({ where: { campaignId: id, version } })
    if (!template) return null
    if (activate) await tx.campaignTemplateVersion.updateMany({ where: { campaignId: id, isActive: true, NOT: { id: template.id } }, data: { isActive: false } })
    const result = await tx.campaignTemplateVersion.update({ where: { id: template.id }, data: { ...(name !== undefined ? { name } : {}), ...(activate ? { isActive: true } : {}) } })
    await tx.auditLog.create({ data: { actor: session.user.id, action: activate ? 'campaign.template.version.activated' : 'campaign.template.version.renamed', entityType: 'campaign', entityId: id, details: { version, name: result.name } } })
    return result
  })
  if (!updated) return Response.json({ error: 'Template tidak ditemukan.' }, { status: 404 })
  return Response.json({ template: updated }, { headers: { 'Cache-Control': 'no-store' } })
}
