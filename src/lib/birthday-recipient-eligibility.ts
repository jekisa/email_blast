const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const dummyMarkers = ['noemail@', 'no-email@', 'tidakada@', 'dummy@', 'test@', 'none@', 'guest@sanghyang']

// Misspelt webmail domains (gamil.com, gmail.comm, yahoo.co.com) bounce or reach typo-squatters; bounces count
// against the SMTP account's hourly failure quota, which stopped sending on 15 Oct 2026.
const knownMailDomains = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.id', 'ymail.com', 'rocketmail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'aol.com', 'mail.com', 'email.com'])
const typoTargets = ['gmail.com', 'yahoo.com', 'yahoo.co.id', 'hotmail.com', 'outlook.com']
const typoSuffix = /\.(comm|con|coom|co\.com)$/
const regionalWebmail = /^(yahoo|hotmail|outlook|live)\.(co|com)\.[a-z]{2}$/

function editDistance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    previous = current
  }
  return previous[b.length]
}

export function isMisspeltMailDomain(domain: string) {
  if (knownMailDomains.has(domain) || regionalWebmail.test(domain)) return false
  return typoSuffix.test(domain) || typoTargets.some((target) => editDistance(domain, target) <= 2)
}

// The webmail domain a misspelt one most likely meant (gmial.com -> gmail.com), or null when unclear.
export function correctMailDomain(domain: string) {
  if (!isMisspeltMailDomain(domain)) return null
  // Owner's call (15 Oct 2026): yahoo.co.com means yahoo.com.
  if (domain.endsWith('.co.com') && typoTargets.includes(domain.replace(/\.co\.com$/, '.com'))) return domain.replace(/\.co\.com$/, '.com')
  const [best, next] = typoTargets.map((target) => ({ target, distance: editDistance(domain, target) })).sort((a, b) => a.distance - b.distance)
  return best.distance <= 2 && best.distance < next.distance ? best.target : null
}

// Same address with a misspelt webmail domain fixed; the part before @ is kept as typed.
export function correctBirthdayEmail(email: string) {
  const trimmed = email.trim()
  const at = trimmed.lastIndexOf('@')
  const fix = at > 0 ? correctMailDomain(trimmed.slice(at + 1).toLocaleLowerCase()) : null
  return fix ? `${trimmed.slice(0, at + 1)}${fix}` : trimmed
}

export function isUsableBirthdayEmail(email: string) {
  const normalizedEmail = email.trim().toLocaleLowerCase()
  return validEmail.test(normalizedEmail)
    && !dummyMarkers.some((marker) => normalizedEmail.includes(marker))
    && !isMisspeltMailDomain(normalizedEmail.slice(normalizedEmail.lastIndexOf('@') + 1))
}

export function isEligibleBirthdayRecipient(email: string, isActive: boolean, isBlacklisted: boolean) {
  return isActive && !isBlacklisted && isUsableBirthdayEmail(email)
}

// Whole years between a birth date and a day (both YYYY-MM-DD).
export function ageOn(birthDateIso: string, dayIso: string) {
  const years = Number(dayIso.slice(0, 4)) - Number(birthDateIso.slice(0, 4))
  return dayIso.slice(5) < birthDateIso.slice(5) ? years - 1 : years
}

// Owner decision (17 Oct 2026): contacts aged 80+ are almost always mistyped birth dates or a relative's mail.
export const maxBirthdayAge = 80

// Contacts created by scripts (never by import) are test inboxes; keep them out of monitoring and forecasts.
export const testSources = ['manual', 'birthday_email_test']
