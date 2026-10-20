import { createClient } from '@supabase/supabase-js'
import { prisma } from '../../../../src/lib/prisma'
import { requireAdmin } from '../../../../src/lib/require-admin'

export const runtime = 'nodejs'
const maxBytes = 5 * 1024 * 1024
const bucket = 'birthday-campaign-assets'

function imageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x89 && new TextDecoder().decode(bytes.slice(1, 4)) === 'PNG') return 'image/png'
  if (new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') return 'image/webp'
  return null
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  const campaignId = form?.get('campaignId')
  const altText = form?.get('altText')
  if (!(file instanceof File) || typeof campaignId !== 'string' || !campaignId) return Response.json({ error: 'File dan campaign wajib dipilih.' }, { status: 400 })
  if (file.size === 0 || file.size > maxBytes) return Response.json({ error: 'Gambar harus berukuran 1 byte sampai 5 MB.' }, { status: 400 })
  const bytes = new Uint8Array(await file.arrayBuffer())
  const mimeType = imageType(bytes)
  if (!mimeType || file.type !== mimeType) return Response.json({ error: 'File harus berupa JPEG, PNG, atau WebP yang valid.' }, { status: 415 })
  const campaignExists = await prisma.campaign.findUnique({ where: { id: campaignId }, select: { id: true } })
  if (!campaignExists) return Response.json({ error: 'Campaign tidak ditemukan.' }, { status: 404 })

  const supabaseUrl = process.env.SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const configuredBucket = process.env.SUPABASE_STORAGE_BUCKET
  if (!supabaseUrl || !secretKey || configuredBucket !== bucket) return Response.json({ error: 'Storage server belum dikonfigurasi.' }, { status: 503 })
  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp'
  const objectPath = `${campaignId}/${crypto.randomUUID()}.${extension}`
  const upload = await supabase.storage.from(bucket).upload(objectPath, bytes, { contentType: mimeType, cacheControl: '31536000', upsert: false })
  if (upload.error) return Response.json({ error: 'Gambar gagal disimpan.' }, { status: 502 })
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl
  try {
    const asset = await prisma.$transaction(async (tx) => {
      const created = await tx.campaignAsset.create({ data: { campaignId, objectPath, publicUrl, mimeType, byteSize: BigInt(file.size), altText: typeof altText === 'string' ? altText.slice(0, 250) : '' } })
      await tx.auditLog.create({ data: { actor: session.user.id, action: 'campaign.asset.uploaded', entityType: 'campaign_asset', entityId: created.id, details: { campaignId, mimeType, byteSize: file.size } } })
      return created
    })
    return Response.json({ asset: { ...asset, byteSize: asset.byteSize.toString() } }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    await supabase.storage.from(bucket).remove([objectPath])
    throw error
  }
}
