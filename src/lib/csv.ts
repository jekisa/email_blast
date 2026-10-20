// CSV for Excel: UTF-8 BOM, CRLF, quoted where needed. A cell starting with = + - @ (or tab/CR) gets a leading '
// so a spreadsheet never runs it as a formula.
export function toCsv(rows: (string | number | null | undefined)[][]) {
  const cell = (value: string | number | null | undefined) => {
    let text = value === null || value === undefined ? '' : String(value)
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
    return /[",;\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  return `﻿${rows.map((row) => row.map(cell).join(',')).join('\r\n')}\r\n`
}

// +6281234567890 -> "0812 3456 7890": local form that spreadsheets keep as text (no 6.28E+12, no lost +).
export function displayPhone(phone: string | null) {
  if (!phone) return ''
  const local = phone.startsWith('+62') ? `0${phone.slice(3)}` : phone
  return local.replace(/(\d{4})(?=\d)/g, '$1 ')
}
