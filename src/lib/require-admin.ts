import 'server-only'
import { auth } from './auth'

export async function requireAdmin(request: Request) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin')
    let sameOrigin = false
    try {
      const originUrl = new URL(origin!)
      const requestUrl = new URL(request.url)
      const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
      const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
      const requestHost = forwardedHost || request.headers.get('host') || requestUrl.host
      const requestProtocol = (forwardedProtocol || requestUrl.protocol).replace(/:$/, '').toLowerCase()
      sameOrigin = originUrl.host.toLowerCase() === requestHost.toLowerCase() && originUrl.protocol === `${requestProtocol}:`
    } catch { /* missing or malformed origin */ }
    if (!sameOrigin) {
      return { session: null, response: Response.json({ error: 'Asal permintaan tidak diizinkan.' }, { status: 403 }) }
    }
  }
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return { session: null, response: Response.json({ error: 'Silakan login.' }, { status: 401 }) }
  if (session.user.role !== 'admin') return { session: null, response: Response.json({ error: 'Akses administrator diperlukan.' }, { status: 403 }) }
  return { session, response: null }
}
