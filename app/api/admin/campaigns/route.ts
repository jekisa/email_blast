import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { requireAdmin } from '../../../../src/lib/require-admin'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const campaigns = await prisma.campaign.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { templates: { where: { isActive: true } }, promos: { where: { isActive: true } }, assets: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  return NextResponse.json({ campaigns }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const input: unknown = await request.json().catch(() => null)
  if (!input || typeof input !== 'object' || !('name' in input) || typeof input.name !== 'string') {
    return NextResponse.json({ error: 'Nama campaign wajib diisi.' }, { status: 400 })
  }
  const name = input.name.trim()
  if (!name || name.length > 100) return NextResponse.json({ error: 'Nama campaign harus 1–100 karakter.' }, { status: 400 })

  const campaign = await prisma.$transaction(async (tx) => {
    const created = await tx.campaign.create({ data: { name, status: 'draft', sendOffsetDays: 0, sendTime: new Date('1970-01-01T00:00:00.000Z'), timezone: 'Asia/Jakarta', ctaLabel: 'Sanghyang Indah Spa Resort', ctaUrl: 'https://sanghyang.com/' } })
    await tx.campaignTemplateVersion.create({ data: {
      campaignId: created.id,
      version: 1,
      subject: 'Selamat ulang tahun, {{first_name}}!',
      bodyHtml: 'Halo {{first_name}},<br><br>Selamat ulang tahun! Semoga hari istimewa ini penuh kebahagiaan, kesehatan, dan momen indah.<br><br>Terima kasih telah menjadi bagian dari Sanghyang. Kami berharap dapat menyambut Anda kembali.<br><br>Salam hangat,<br>Tim Sanghyang',
      isActive: true,
    } })
    await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.created', entityType: 'campaign', entityId: created.id, details: { status: 'draft' } } })
    return created
  })
  return NextResponse.json({ campaign }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
}
