import 'server-only'
import nodemailer from 'nodemailer'

export function renderBirthdayEmail(input: { subject: string; bodyHtml: string; firstName: string; promoTitle: string; promoDescription?: string; promoTerms?: string; promoCode: string; promoValidFrom?: string; promoValidUntil?: string; bookingUrl: string; websiteUrl: string; claimUrl?: string | null; imageUrl?: string }) {
  const safe = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
  const variables: Record<string, string> = {
    first_name: safe(input.firstName), promo_name: safe(input.promoTitle), promo_description: safe(input.promoDescription ?? ''), promo_terms: safe(input.promoTerms ?? ''), promo_code: safe(input.promoCode), promo_valid_from: safe(input.promoValidFrom ?? ''), promo_valid_until: safe(input.promoValidUntil ?? ''), booking_url: safe(input.bookingUrl),
  }
  const subject = input.subject.replace(/\{\{(first_name|promo_name|promo_code)\}\}/g, (_, key: string) => variables[key])
  const body = input.bodyHtml.replace(/\{\{(first_name|promo_name|promo_description|promo_terms|promo_code|promo_valid_from|promo_valid_until|booking_url)\}\}/g, (_, key: string) => variables[key])
  const image = input.imageUrl ? `<img src="${safe(input.imageUrl)}" alt="Kartu ucapan ulang tahun Sanghyang" style="display:block;width:100%;height:auto">` : ''
  const claimButton = input.claimUrl ? `<p style="margin:24px 0 8px"><a href="${safe(input.claimUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#294b39;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px">Claim Your Birthday Treats</a></p>` : ''
  // Link text must not look like a URL: text showing sanghyang.com over an href on another domain is a phishing
  // signal, and the hosting provider's outbound filter rejected mail as spam on 16 Oct 2026.
  const bookingLink = `<p style="margin:0"><a href="${safe(input.bookingUrl)}" target="_blank" rel="noopener noreferrer" style="color:#3f6f59">Kunjungi website Sanghyang</a></p>`
  const html = `<!doctype html><html lang="id"><body style="margin:0;background:#f4f6f1;font-family:Arial,sans-serif;color:#34443a"><main style="max-width:600px;margin:24px auto;background:white;border-radius:10px;overflow:hidden">${image}<section style="padding:24px;line-height:1.7">${body}${claimButton}${bookingLink}</section></main></body></html>`
  // HTML-only mail scores as spam; send the same message as plain text too.
  const plainBody = body.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '').replace(/&(amp|lt|gt|quot|#39);/g, (_, entity: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[entity]!).trim()
  const text = [plainBody, input.claimUrl ? `Claim Your Birthday Treats: ${input.claimUrl}` : '', `Website Sanghyang: ${input.bookingUrl}`].filter(Boolean).join('\n\n')
  return { subject, html, text }
}

// Links and images in mail point at our own domain (EMAIL_LINK_BASE_URL, e.g. https://promo.sanghyang.com) when set:
// vercel.app links are widely abused for phishing and count against us in spam filters.
export function emailLinkBase(requestUrl: string) {
  const base = process.env.EMAIL_LINK_BASE_URL?.trim()
  return base && /^https:\/\/[a-z0-9.-]+\/?$/i.test(base) ? base : requestUrl
}

export function createSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim()
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM?.trim()
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase()
  const secure = secureValue === 'true'
  if (!host || !Number.isInteger(port) || port < 1 || port > 65_535 || !user || !pass || !from || !['true', 'false'].includes(secureValue ?? '')) throw new Error('Konfigurasi SMTP belum lengkap.')
  return { transporter: nodemailer.createTransport({ host, port, secure, auth: { user, pass }, pool: true, maxConnections: 1 }), from, replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined }
}
