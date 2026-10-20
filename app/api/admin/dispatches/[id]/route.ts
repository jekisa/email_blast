import { prisma } from '../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../src/lib/require-admin'

const stuckAfterMs = 10 * 60 * 1000

// Admin follow-up for a problem dispatch: resend it once, or mark it reviewed without sending.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: 'Pengiriman tidak ditemukan.' }, { status: 404 })
  const input: unknown = await request.json().catch(() => null)
  const action = input && typeof input === 'object' && 'action' in input ? input.action : null
  if (action !== 'resend' && action !== 'reviewed') return Response.json({ error: 'Aksi tidak valid.' }, { status: 400 })

  const result = await prisma.$transaction(async (tx) => {
    const dispatch = await tx.birthdayDispatch.findUnique({ where: { id }, select: { status: true, attemptCount: true, claimedAt: true, errorMessage: true, events: { where: { eventType: 'smtp_accepted' }, select: { id: true }, take: 1 } } })
    if (!dispatch) return 'not-found' as const
    const stuck = dispatch.status === 'processing' && (!dispatch.claimedAt || Date.now() - dispatch.claimedAt.getTime() > stuckAfterMs)
    if (!['error', 'rejected'].includes(dispatch.status) && !stuck) return 'not-problem' as const
    // One manual resend only, and never after the SMTP server confirmed an earlier attempt.
    if (action === 'resend' && (dispatch.events.length || dispatch.attemptCount >= 2)) return 'resend-blocked' as const
    const updated = await tx.birthdayDispatch.updateMany({
      where: { id, status: dispatch.status },
      data: action === 'resend'
        ? { status: 'queued', claimToken: null, errorMessage: null, updatedAt: new Date() }
        : { status: 'cancelled', claimToken: null, errorMessage: `Diperiksa admin, tidak dikirim ulang. ${dispatch.errorMessage ?? ''}`.trim().slice(0, 500), updatedAt: new Date() },
    })
    if (updated.count !== 1) return 'not-problem' as const
    await tx.auditLog.create({ data: { actor: session.user.id, action: action === 'resend' ? 'dispatch.manual_resend' : 'dispatch.reviewed', entityType: 'birthday_dispatch', entityId: id, details: { previousStatus: dispatch.status, attemptCount: dispatch.attemptCount } } })
    return 'ok' as const
  })
  if (result === 'not-found') return Response.json({ error: 'Pengiriman tidak ditemukan.' }, { status: 404 })
  if (result === 'not-problem') return Response.json({ error: 'Pengiriman ini tidak lagi perlu diperiksa.' }, { status: 409 })
  if (result === 'resend-blocked') return Response.json({ error: 'Tidak bisa dikirim ulang: sudah pernah dicoba ulang atau sudah diterima SMTP.' }, { status: 409 })
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
