import assert from 'node:assert/strict'
import test from 'node:test'
import { displayPhone, toCsv } from './csv.ts'

test('toCsv quotes separators and neutralises spreadsheet formulas', () => {
  assert.equal(toCsv([['Nama', 'Kota'], ['Budi, S', 'Serang'], ['=HYPERLINK("x")', '@cmd'], ['-5', 'say "hi"'], [null, 3]]),
    '﻿Nama,Kota\r\n"Budi, S",Serang\r\n"\'=HYPERLINK(""x"")",\'@cmd\r\n\'-5,"say ""hi"""\r\n,3\r\n')
})

test('displayPhone shows Indonesian numbers in local, text-safe form', () => {
  assert.equal(displayPhone('+6281234567890'), '0812 3456 7890')
  assert.equal(displayPhone('+81312345678'), '+81312345678'.replace(/(\d{4})(?=\d)/g, '$1 '))
  assert.equal(displayPhone(null), '')
})
