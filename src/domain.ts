import { correctMailDomain } from './lib/birthday-recipient-eligibility'

export type EmailStatus = 'VALID' | 'INVALID' | 'DUMMY' | 'SUSPECTED_TYPO' | 'UNKNOWN' | 'NEEDS_REVIEW'
export type ImportStatus = 'VALID' | 'ERROR'

export type Customer = {
  id: string
  fullName: string
  firstName: string
  birthDate: string
  email: string
  emailNormalized: string
  emailStatus: EmailStatus
  blacklisted: boolean
  duplicateGroupId: string | null
  dataQualityScore: number
  reviewReason: string[]
  importBatchId: string | null
  createdAt: string
  updatedAt: string
  source: 'DEMO' | 'IMPORT' | 'MANUAL'
}

export type Campaign = {
  id: string
  name: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED'
  sendOffsetDays: number
  sendTime: string
  timezone: 'Asia/Jakarta'
  activeTemplateId: string
  activePromoId: string | null
  createdAt: string
  updatedAt: string
}

export type TemplateVersion = {
  id: string
  campaignId: string
  version: number
  subject: string
  body: string
  createdAt: string
}

export type Promo = {
  id: string
  campaignId: string
  title: string
  description: string
  codePrefix: string
  validDaysAfterBirthday: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type Dispatch = {
  id: string
  customerId: string
  campaignId: string
  channel: 'EMAIL'
  birthdayYear: number
  scheduledAt: string
  status: 'PREVIEW_QUEUED'
  createdAt: string
}

export type ImportBatch = {
  id: string
  fileName: string
  fileHash: string
  importedAt: string
  importedCount: number
  reviewCount: number
  errorCount: number
}

export type ImportRow = {
  recordNumber: number
  rawName: string
  rawBirthDate: string
  rawEmail: string
  fullName: string
  firstName: string
  birthDate: string
  emailNormalized: string
  emailSuggestion: string
  emailStatus: EmailStatus
  phone: string
  city: string
  countryCode: string
  dataQualityScore: number
  status: ImportStatus
  reviewReason: string[]
  selected: boolean
}

export type ParsedFile = {
  headers: string[]
  rows: string[][]
  delimiter: string
  sourceFormat?: 'delimited' | 'sanghyang-report'
  previewOnly?: boolean
}

export type ImportMapping = { name: number; birthDate: number; email: number; phone?: number; city?: number }

const DUMMY_EMAIL_MARKERS = ['noemail@', 'no-email@', 'tidakada@', 'dummy@', 'test@', 'none@', 'guest@sanghyang']
const TITLES = /^(MR|MRS|MS|MISS|DR|DRS|DRA|PROF|HJ|HAJI|IR)\.?\s+/i

export function normalizeName(value: string) {
  const withoutTitle = value.trim().replace(TITLES, '')
  const cleaned = withoutTitle.replace(/[^\p{L}\p{M}\s'-]/gu, ' ').replace(/\s+/g, ' ').trim()
  const fullName = cleaned.split(' ').filter(Boolean).map((word) => word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()).join(' ')
  const firstName = fullName.split(' ')[0] ?? ''
  return { fullName, firstName }
}

export function normalizeEmail(value: string) {
  const email = value.trim().toLocaleLowerCase()
  if (!email) return { email, status: 'UNKNOWN' as EmailStatus, suggestion: '' }
  if (DUMMY_EMAIL_MARKERS.some((marker) => email.includes(marker))) return { email, status: 'DUMMY' as EmailStatus, suggestion: '' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { email, status: 'INVALID' as EmailStatus, suggestion: '' }
  const domain = email.split('@').at(-1) ?? ''
  const correctedDomain = correctMailDomain(domain)
  return correctedDomain
    ? { email, status: 'SUSPECTED_TYPO' as EmailStatus, suggestion: email.replace(/@[^@]+$/, `@${correctedDomain}`) }
    : { email, status: 'VALID' as EmailStatus, suggestion: '' }
}

// One phone number in international form: 08… and 021… become +62…; '' when it does not look like a number.
export function normalizePhone(value: string) {
  const first = value.split(/[/,;]/)[0].trim()
  const digits = first.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return ''
  if (first.startsWith('+')) return `+${digits}`
  if (digits.startsWith('62')) return `+${digits}`
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`
  if (digits.startsWith('8')) return `+62${digits}`
  return digits
}

// "INA -  SERANG" (hotel report) -> { countryCode: 'INA', city: 'Serang' }; a plain city name is kept as the city.
export function parseLocation(value: string) {
  const match = /\b([A-Z]{3})\s*-\s+([A-Za-z][A-Za-z .'/()-]*?)\s*$/.exec(value.trim())
  const titleCase = (text: string) => text.toLocaleLowerCase().replace(/(^|[\s/(-])(\p{L})/gu, (_, gap: string, letter: string) => gap + letter.toLocaleUpperCase())
  if (match) return { countryCode: match[1], city: titleCase(match[2].replace(/\s+/g, ' ').trim()).slice(0, 80) }
  const city = value.replace(/\s+/g, ' ').trim()
  return { countryCode: '', city: city ? titleCase(city).slice(0, 80) : '' }
}

export function normalizeBirthDate(value: string): string | null {
  const text = value.trim()
  let year = 0
  let month = 0
  let day = 0
  let match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(text)
  if (match) { year = Number(match[1]); month = Number(match[2]); day = Number(match[3]) }
  else {
    match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(text)
    if (match) { day = Number(match[1]); month = Number(match[2]); year = Number(match[3]) }
    else {
      match = /^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{4})$/.exec(text)
      if (!match) return null
      day = Number(match[1]); year = Number(match[3])
      month = new Date(`${match[2]} 1, 2000`).getMonth() + 1
      if (!month) return null
    }
  }
  const date = new Date(Date.UTC(year, month - 1, day))
  if (year < 1900 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  const today = jakartaDateParts(new Date())
  const birthday = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  const todayIso = `${today.year}-${today.month}-${today.day}`
  return birthday <= todayIso ? birthday : null
}

export function jakartaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return { year: values.year, month: values.month, day: values.day }
}

export function birthdayMidnightJakarta(birthDate: string | Date, year: number) {
  const isoDate = birthDate instanceof Date ? birthDate.toISOString().slice(0, 10) : birthDate
  const [, month, originalDay] = isoDate.split('-').map(Number)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const day = month === 2 && originalDay === 29 && !leap ? 28 : originalDay
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return new Date(`${date}T00:00:00+07:00`)
}

export function calculateAge(birthDate: string, today = new Date()): number | null {
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number)
  if (!birthYear || !birthMonth || !birthDay) return null
  const current = jakartaDateParts(today)
  const year = Number(current.year)
  const month = Number(current.month)
  const day = Number(current.day)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const anniversaryDay = birthMonth === 2 && birthDay === 29 && !leap ? 28 : birthDay
  return year - birthYear - (month < birthMonth || (month === birthMonth && day < anniversaryDay) ? 1 : 0)
}

export function birthdaySchedule(birthDate: string, offsetDays: number, today = new Date()) {
  const parts = jakartaDateParts(today)
  const [, month, day] = birthDate.split('-').map(Number)
  const validationDate = new Date(Date.UTC(2000, month - 1, day))
  if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1
    || validationDate.getUTCMonth() !== month - 1 || validationDate.getUTCDate() !== day
    || !Number.isInteger(offsetDays) || offsetDays < -366 || offsetDays > 366) return null
  const todayIso = `${parts.year}-${parts.month}-${parts.day}`
  let year = Number(parts.year)
  const dateForYear = (birthdayYear: number) => {
    const leap = birthdayYear % 4 === 0 && (birthdayYear % 100 !== 0 || birthdayYear % 400 === 0)
    const effectiveDay = month === 2 && day === 29 && !leap ? 28 : day
    const scheduled = new Date(Date.UTC(birthdayYear, month - 1, effectiveDay + offsetDays))
    return `${scheduled.getUTCFullYear()}-${String(scheduled.getUTCMonth() + 1).padStart(2, '0')}-${String(scheduled.getUTCDate()).padStart(2, '0')}`
  }
  let date = dateForYear(year)
  if (date < todayIso) date = dateForYear(++year)
  return {
    birthdayYear: year,
    date,
  }
}

export function scheduleDate(birthDate: string, offsetDays: number, today = new Date()) {
  return birthdaySchedule(birthDate, offsetDays, today)?.date ?? ''
}

function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1 }
      else quoted = !quoted
    } else if (char === delimiter && !quoted) {
      row.push(field); field = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(field); field = ''
      if (row.some((cell) => cell.trim())) rows.push(row)
      row = []
    } else field += char
  }
  row.push(field)
  if (row.some((cell) => cell.trim())) rows.push(row)
  if (quoted) throw new Error('File berisi tanda kutip yang tidak berpasangan.')
  return rows
}

export function parseDelimitedFile(text: string): ParsedFile {
  const content = text.replace(/^\uFEFF/, '')
  const candidates = ['\t', '|', ',', ';'].map((delimiter) => ({ delimiter, rows: parseDelimited(content, delimiter) }))
  const best = candidates.sort((a, b) => {
    const score = (rows: string[][]) => rows.slice(0, 25).filter((row) => row.length > 1).length * 100 + Math.min(50, Math.max(...rows.slice(0, 25).map((row) => row.length), 0))
    return score(b.rows) - score(a.rows)
  })[0]
  if (!best || best.rows.length < 2 || best.rows[0].length < 2) throw new Error('Tidak menemukan kolom tabel. Gunakan CSV atau TSV dengan baris header.')
  const width = best.rows[0].length
  const normalizedRows = best.rows.slice(1).map((row) => [...row.slice(0, width), ...Array(Math.max(0, width - row.length)).fill('')])
  return { headers: best.rows[0].map((header) => header.trim()), rows: normalizedRows, delimiter: best.delimiter, sourceFormat: 'delimited' }
}

const reportPlace = /\b([A-Z]{3})\s*-\s+([A-Za-z][A-Za-z .'/()-]*?)(?=\s{2,}|\s*[+\d]|$)/g

export function parseSanghyangTextReport(text: string): ParsedFile {
  const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n|\f/)
  const hasExpectedHeader = lines.some((line) => line.length >= 160
    && /guest\s+name/i.test(line.slice(0, 37))
    && /birthdate/i.test(line.slice(37, 52))
    && /email/i.test(line.slice(150, 175)))
  if (!hasExpectedHeader) throw new Error('Format laporan tamu tidak dikenali; tidak ada data yang disimpan.')

  const rows: string[][] = []
  for (const line of lines) {
    if (line.length < 170) continue
    const rawBirthDate = line.slice(37, 47).trim()
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(rawBirthDate)) continue
    const sourceName = line.slice(0, 37).trim()
    const comma = sourceName.indexOf(',')
    const rawName = comma > 0
      ? `${sourceName.slice(comma + 1).trim()} ${sourceName.slice(0, comma).trim()}`
      : sourceName
    const rawEmail = line.slice(157).trim()
    // Mobile No (141-157) if usable, else Tel No (120-141). The street address (71-104) is not kept; it often
    // overflows into City, so the "INA -  SERANG" pair nearest the City column (104) is taken from 71-141.
    const phone = normalizePhone(line.slice(141, 157)) || normalizePhone(line.slice(120, 141))
    let place: RegExpMatchArray | undefined
    for (const match of line.slice(71, 141).matchAll(reportPlace)) if (!place || Math.abs(match.index! + 71 - 104) < Math.abs(place.index! + 71 - 104)) place = match
    rows.push([rawName, rawBirthDate, rawEmail, phone, place ? `${place[1]} - ${place[2]}` : ''])
  }
  if (rows.length < 25) throw new Error('Baris pelanggan laporan tidak cukup untuk memastikan format; tidak ada data yang disimpan.')
  return { headers: ['Guest Name', 'Birthdate', 'Email Address', 'Phone', 'City'], rows, delimiter: 'fixed-width', sourceFormat: 'sanghyang-report', previewOnly: true }
}

function findColumn(headers: string[], aliases: string[]) {
  const normalized = headers.map((header) => header.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
  return normalized.findIndex((header) => aliases.some((alias) => header === alias || header.includes(alias)))
}

export function inferColumnMapping(headers: string[]) {
  return {
    name: findColumn(headers, ['guest name', 'full name', 'customer name', 'name']),
    birthDate: findColumn(headers, ['birthdate', 'birth date', 'date of birth', 'dob']),
    email: findColumn(headers, ['email address', 'email']),
    phone: findColumn(headers, ['phone', 'mobile', 'handphone', 'no hp', 'tel no', 'telephone']),
    city: findColumn(headers, ['city', 'kota']),
  }
}

export function normalizeImportRows(parsed: ParsedFile, mapping: ImportMapping): ImportRow[] {
  return parsed.rows.map((row, index) => {
    const rawName = row[mapping.name] ?? ''
    const rawBirthDate = row[mapping.birthDate] ?? ''
    const rawEmail = row[mapping.email] ?? ''
    const { fullName, firstName } = normalizeName(rawName)
    const birthDate = normalizeBirthDate(rawBirthDate)
    const email = normalizeEmail(rawEmail)
    const phone = mapping.phone !== undefined && mapping.phone >= 0 ? normalizePhone(row[mapping.phone] ?? '') : ''
    const location = mapping.city !== undefined && mapping.city >= 0 ? parseLocation(row[mapping.city] ?? '') : { city: '', countryCode: '' }
    const reviewReason: string[] = []
    if (fullName.split(' ').length < 2) reviewReason.push('Nama perlu ditinjau')
    if (!birthDate) reviewReason.push('Tanggal lahir tidak terbaca atau di masa depan')
    if (email.status === 'SUSPECTED_TYPO') reviewReason.push(`Domain email salah ketik; disimpan sebagai ${email.suggestion}`)
    if (email.status === 'INVALID' || email.status === 'DUMMY' || email.status === 'UNKNOWN') reviewReason.push(`Email ${email.status.toLowerCase()}`)
    const score = Math.max(0, (fullName ? 25 : 0) + (birthDate ? 35 : 0) + (email.status === 'VALID' ? 40 : 0) - reviewReason.length * 8)
    const status: ImportStatus = !fullName || !birthDate ? 'ERROR' : 'VALID'
    return { recordNumber: index + 2, rawName, rawBirthDate, rawEmail, fullName, firstName, birthDate: birthDate ?? '', emailNormalized: email.email, emailSuggestion: email.suggestion, emailStatus: email.status, phone, city: location.city, countryCode: location.countryCode, dataQualityScore: score, status, reviewReason, selected: status !== 'ERROR' }
  })
}

export function flagPotentialDuplicateRows(rows: ImportRow[]): ImportRow[] {
  const groups = new Map<string, number[]>()
  rows.forEach((row, index) => {
    if (!row.birthDate) return
    const nameKey = row.fullName ? `name:${row.fullName.toLocaleLowerCase()}|${row.birthDate}` : ''
    const emailKey = row.emailNormalized ? `email:${row.emailNormalized}|${row.birthDate}` : ''
    for (const key of [nameKey, emailKey].filter(Boolean)) {
      const indices = groups.get(key)
      if (indices) indices.push(index)
      else groups.set(key, [index])
    }
  })
  const duplicates = new Set<number>()
  groups.forEach((indices) => { if (indices.length > 1) indices.forEach((index) => duplicates.add(index)) })
  return rows.map((row, index) => {
    if (!duplicates.has(index)) return row
    const reason = 'Kemungkinan duplikat nama/email dan tanggal lahir; perlu review'
    return { ...row, reviewReason: [...new Set([...row.reviewReason, reason])] }
  })
}

export function previewTemplate(body: string, customer: Customer, promoTitle = 'Birthday gift') {
  return body.replaceAll('{{first_name}}', customer.firstName).replaceAll('{{promo_name}}', promoTitle).replaceAll('{{booking_url}}', 'https://example.com/booking')
}
