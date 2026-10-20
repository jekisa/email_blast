import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import nodemailer from 'nodemailer'
import { loadEnv, type Plugin } from 'vite'

const CARD_CID = 'birthday-card'
const MAX_BODY_BYTES = 16 * 1024
const SEND_COOLDOWN_MS = 15_000
let lastSentAt = 0
let birthdayCardPath = ''

type TestEmailInput = { subject?: unknown; body?: unknown; promoTitle?: unknown }

function json(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(data))
}

function getConfig() {
  const values = {
    SMTP_HOST: process.env.SMTP_HOST?.trim() ?? '',
    SMTP_PORT: process.env.SMTP_PORT?.trim() ?? '',
    SMTP_SECURE: process.env.SMTP_SECURE?.trim().toLocaleLowerCase() ?? '',
    SMTP_USER: process.env.SMTP_USER?.trim() ?? '',
    SMTP_PASS: process.env.SMTP_PASS ?? '',
    EMAIL_FROM: process.env.EMAIL_FROM?.trim() ?? '',
    TEST_RECIPIENT: process.env.TEST_RECIPIENT?.trim().toLocaleLowerCase() ?? '',
    BOOKING_URL: process.env.BOOKING_URL?.trim() ?? '',
    EMAIL_SANDBOX_MODE: process.env.EMAIL_SANDBOX_MODE?.trim().toLocaleLowerCase() ?? '',
  }
  const missing = Object.entries(values)
    .filter(([name, value]) => !value.trim() || (name === 'EMAIL_SANDBOX_MODE' && value !== 'true'))
    .map(([name]) => name)
  const port = Number(values.SMTP_PORT)
  if (values.SMTP_PORT && (!Number.isInteger(port) || port < 1 || port > 65_535) && !missing.includes('SMTP_PORT')) missing.push('SMTP_PORT')
  if (values.SMTP_SECURE && !['true', 'false'].includes(values.SMTP_SECURE) && !missing.includes('SMTP_SECURE')) missing.push('SMTP_SECURE')
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (values.EMAIL_FROM && !emailPattern.test(values.EMAIL_FROM) && !missing.includes('EMAIL_FROM')) missing.push('EMAIL_FROM')
  if (values.TEST_RECIPIENT && !emailPattern.test(values.TEST_RECIPIENT) && !missing.includes('TEST_RECIPIENT')) missing.push('TEST_RECIPIENT')
  let bookingUrlValid = false
  try { bookingUrlValid = new URL(values.BOOKING_URL).protocol === 'https:' } catch { /* invalid configuration */ }
  if (values.BOOKING_URL && !bookingUrlValid && !missing.includes('BOOKING_URL')) missing.push('BOOKING_URL')
  return { values, missing, ready: missing.length === 0 }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

function renderEmail(input: { subject: string; body: string; promoTitle: string; bookingUrl: string }) {
  const variables: Record<string, string> = {
    first_name: 'Nama Uji',
    promo_name: input.promoTitle,
    promo_code: 'BDAY-TEST',
    booking_url: input.bookingUrl,
  }
  const personalize = (value: string) => escapeHtml(value).replace(/\{\{(first_name|promo_name|promo_code|booking_url)\}\}/g, (_, name: string) => escapeHtml(variables[name]))
  const message = personalize(input.body).replace(/\r?\n/g, '<br>')
  const html = `<!doctype html><html><body style="margin:0;background:#f5f6f2;font-family:Arial,sans-serif;color:#34443a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6f2;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden"><tr><td><img src="cid:${CARD_CID}" alt="Kartu ucapan ulang tahun Sanghyang" width="600" style="display:block;width:100%;height:auto;border:0"></td></tr><tr><td style="padding:28px 30px;font-size:16px;line-height:1.7">${message}<p style="margin:26px 0"><a href="${escapeHtml(input.bookingUrl)}" style="display:inline-block;background:#294b39;color:#fff;text-decoration:none;padding:13px 22px;border-radius:6px">Lihat informasi</a></p><p style="font-size:12px;color:#7c887d">Ini email uji lokal untuk memeriksa tampilan template.</p></td></tr></table></td></tr></table></body></html>`
  return { subject: personalize(input.subject), html }
}

async function readJson(request: IncomingMessage): Promise<TestEmailInput> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('Ukuran permintaan terlalu besar.')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as TestEmailInput
}

async function handle(request: IncomingMessage, response: ServerResponse) {
  const config = getConfig()
  if (request.method === 'GET') {
    json(response, 200, { ready: config.ready, missing: config.missing, testRecipient: config.values.TEST_RECIPIENT, from: config.values.EMAIL_FROM })
    return
  }
  if (request.method !== 'POST') { json(response, 405, { error: 'Method tidak diizinkan.' }); return }
  if (request.headers['content-type']?.split(';')[0] !== 'application/json') { json(response, 415, { error: 'Gunakan Content-Type application/json.' }); return }
  if (!config.ready) { json(response, 503, { error: 'Konfigurasi uji email belum lengkap.', missing: config.missing }); return }
  if (Date.now() - lastSentAt < SEND_COOLDOWN_MS) { json(response, 429, { error: 'Tunggu 15 detik sebelum mengirim uji berikutnya.' }); return }

  let input: TestEmailInput
  try { input = await readJson(request) } catch (cause) {
    json(response, 400, { error: cause instanceof Error ? cause.message : 'Permintaan tidak valid.' })
    return
  }
  if (typeof input.subject !== 'string' || input.subject.trim().length < 1 || input.subject.length > 180
    || typeof input.body !== 'string' || input.body.trim().length < 1 || input.body.length > 8_000
    || typeof input.promoTitle !== 'string' || input.promoTitle.length > 180) {
    json(response, 400, { error: 'Subjek, isi email, atau nama promo tidak valid.' })
    return
  }

  let bookingUrl: URL
  try { bookingUrl = new URL(config.values.BOOKING_URL) } catch {
    json(response, 503, { error: 'BOOKING_URL belum valid.' }); return
  }
  if (bookingUrl.protocol !== 'https:') { json(response, 503, { error: 'BOOKING_URL harus menggunakan HTTPS.' }); return }

  try {
    const image = await readFile(birthdayCardPath)
    const { subject, html } = renderEmail({ subject: input.subject.trim(), body: input.body, promoTitle: input.promoTitle.trim(), bookingUrl: bookingUrl.toString() })
    lastSentAt = Date.now()
    const transporter = nodemailer.createTransport({
      host: config.values.SMTP_HOST,
      port: Number(config.values.SMTP_PORT),
      secure: config.values.SMTP_SECURE === 'true',
      requireTLS: config.values.SMTP_SECURE === 'false',
      auth: { user: config.values.SMTP_USER, pass: config.values.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
    let result
    try {
      result = await transporter.sendMail({
        from: config.values.EMAIL_FROM,
        to: config.values.TEST_RECIPIENT,
        subject: `[UJI] ${subject}`,
        html,
        attachments: [{ filename: 'kartu-ucapan-ulang-tahun.jpeg', content: image, contentType: 'image/jpeg', cid: CARD_CID }],
      })
    } finally {
      transporter.close()
    }
    if (result.rejected.length) {
      lastSentAt = 0
      json(response, 502, { error: 'Server SMTP menolak penerima email uji.' })
      return
    }
    json(response, 200, { sent: true, messageId: result.messageId, recipient: config.values.TEST_RECIPIENT })
  } catch (cause) {
    lastSentAt = 0
    const errorCode = typeof cause === 'object' && cause !== null && 'code' in cause ? cause.code : undefined
    json(response, 502, { error: errorCode === 'ETIMEDOUT' ? 'Koneksi SMTP timeout. Periksa host dan port cPanel.' : 'SMTP cPanel gagal menerima email uji. Periksa host, port, TLS, dan kredensial lokal.' })
  }
}

export function testEmailPlugin(): Plugin {
  return {
    name: 'birthday-local-test-email',
    apply: 'serve',
    configResolved(config) {
      birthdayCardPath = resolve(config.root, '..', 'Kartu ucapan ulang tahunjpeg.jpeg')
      const env = loadEnv(config.mode, config.envDir, '')
      for (const [name, value] of Object.entries(env)) {
        if (process.env[name] === undefined) process.env[name] = value
      }
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method === 'GET' && request.url === '/api/birthday-card') {
          void readFile(birthdayCardPath).then((image) => {
            response.statusCode = 200
            response.setHeader('Content-Type', 'image/jpeg')
            response.setHeader('Cache-Control', 'no-store')
            response.end(image)
          }).catch(() => {
            response.statusCode = 404
            response.setHeader('Cache-Control', 'no-store')
            response.end()
          })
          return
        }
        if (!request.url?.startsWith('/api/test-email')) { next(); return }
        void handle(request, response).catch(() => json(response, 500, { error: 'Terjadi kesalahan internal saat memproses email uji.' }))
      })
    },
  }
}
