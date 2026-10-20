import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import test from 'node:test'

registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(/^\.\.?\//.test(specifier) && !/\.\w+$/.test(specifier) ? `${specifier}.ts` : specifier, context)
} })

const { normalizePhone, parseLocation, parseSanghyangTextReport, inferColumnMapping, normalizeImportRows } = await import('../src/domain.ts')
const { ageOn } = await import('../src/lib/birthday-recipient-eligibility.ts')

test('normalizePhone gives one international number or nothing', () => {
  assert.equal(normalizePhone('0812-3456-7890'), '+6281234567890')
  assert.equal(normalizePhone('62 812 3456 7890'), '+6281234567890')
  assert.equal(normalizePhone('812345678901'), '+62812345678901')
  assert.equal(normalizePhone('(0254) 123456'), '+62254123456')
  assert.equal(normalizePhone('+81 3 1234 5678'), '+81312345678')
  assert.equal(normalizePhone('0812 1111 2222 / 0813 3333 4444'), '+6281211112222')
  assert.equal(normalizePhone('-'), '')
  assert.equal(normalizePhone('12345'), '')
})

test('parseLocation splits the report country code from the city', () => {
  assert.deepEqual(parseLocation('INA -  SERANG'), { countryCode: 'INA', city: 'Serang' })
  assert.deepEqual(parseLocation('INA - JAKARTA TIMUR'), { countryCode: 'INA', city: 'Jakarta Timur' })
  assert.deepEqual(parseLocation('bandung'), { countryCode: '', city: 'Bandung' })
  assert.deepEqual(parseLocation(''), { countryCode: '', city: '' })
})

test('hotel report rows carry phone and city, even when the address overflows into City', () => {
  const at = (parts) => { let line = ''; for (const [column, value] of parts) line = line.padEnd(column) + value; return line.padEnd(200) }
  const header = at([[0, 'Guest Name'], [37, 'Birthdate'], [48, 'Arrival'], [57, 'Depart'], [66, 'RmNo'], [71, 'Residential Address'], [104, 'City'], [125, 'Tel No'], [141, 'Mobile No'], [157, 'Email Address']])
  const guest = (index) => at([[0, `TAMU${index}, BUDI`], [37, '01/02/1990'], [66, '0'], [71, 'JL. RAYA ANYER KM 5 RT 01 RW 02 A'], [105, 'INA -  SERANG'], [125, '0254 123456'], [141, index % 2 ? '0812 3456 7890' : ''], [157, `tamu${index}@gmail.com`]])
  const parsed = parseSanghyangTextReport([header, ...Array.from({ length: 30 }, (_, index) => guest(index))].join('\n'))
  const rows = normalizeImportRows(parsed, inferColumnMapping(parsed.headers))
  assert.equal(rows.length, 30)
  assert.deepEqual([rows[1].phone, rows[1].city, rows[1].countryCode], ['+6281234567890', 'Serang', 'INA'])
  assert.equal(rows[0].phone, '+62254123456')
})

test('ageOn counts whole years on a given day', () => {
  assert.equal(ageOn('1946-10-17', '2026-10-17'), 80)
  assert.equal(ageOn('1946-10-18', '2026-10-17'), 79)
  assert.equal(ageOn('2000-02-29', '2026-02-28'), 25)
})
