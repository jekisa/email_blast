import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWhatsAppUrl } from './campaign-url.ts'

test('buildWhatsAppUrl normalizes an international number and encodes the claim message', () => {
  assert.equal(
    buildWhatsAppUrl('+6287871773012', 'Halo, saya ingin klaim Birthday Treats dari Sanghyang.'),
    'https://wa.me/6287871773012?text=Halo%2C%20saya%20ingin%20klaim%20Birthday%20Treats%20dari%20Sanghyang.',
  )
})

test('buildWhatsAppUrl rejects numbers outside the supported international format', () => {
  assert.equal(buildWhatsAppUrl('0878-7177-3012', 'Klaim'), null)
})
