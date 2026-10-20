export function normalizeCampaignUrl(value: string) {
  if (!value.trim() || value.length > 2048) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

export function normalizeWhatsAppPhone(value: string) {
  const phone = value.trim()
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null
}

export function buildWhatsAppUrl(value: string, message?: string) {
  const phone = normalizeWhatsAppPhone(value)
  return phone ? `https://wa.me/${phone.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}` : null
}

export function buildWhatsAppClaimUrl(value: string) {
  return buildWhatsAppUrl(value, 'Halo, saya ingin klaim Birthday Treats dari Sanghyang.')
}
