import assert from 'node:assert/strict'
import test from 'node:test'
import { retryAfterRefusal, smtpErrorDetails } from './smtp-error.ts'

test('smtpErrorDetails keeps the server reply and masks recipient addresses', () => {
  const error = Object.assign(new Error("Can't send mail"), {
    code: 'EENVELOPE',
    responseCode: 550,
    command: 'RCPT TO:<someone@example.com>',
    response: '550 Domain sanghyang.com has exceeded the max emails per hour (60/60 (100%)) allowed. Message to someone@example.com discarded.',
  })
  assert.deepEqual(smtpErrorDetails(error), {
    code: 'EENVELOPE',
    responseCode: 550,
    command: 'RCPT TO',
    response: '550 Domain sanghyang.com has exceeded the max emails per hour (60/60 (100%)) allowed. Message to [email] discarded.',
  })
})

test('smtpErrorDetails returns nothing for connection errors without a reply', () => {
  assert.deepEqual(smtpErrorDetails(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })), { code: 'ETIMEDOUT' })
  assert.deepEqual(smtpErrorDetails('boom'), {})
})

test('retryAfterRefusal waits until 06:00 WIB for night refusals, otherwise the delay', () => {
  const delay = 15 * 60_000
  assert.equal(retryAfterRefusal(new Date('2026-10-18T00:44:18+07:00'), delay).toISOString(), '2026-10-17T23:00:00.000Z')
  assert.equal(retryAfterRefusal(new Date('2026-10-18T05:59:00+07:00'), delay).toISOString(), '2026-10-17T23:00:00.000Z')
  assert.equal(retryAfterRefusal(new Date('2026-10-18T06:00:00+07:00'), delay).toISOString(), '2026-10-17T23:15:00.000Z')
  assert.equal(retryAfterRefusal(new Date('2026-10-17T23:50:00+07:00'), delay).toISOString(), '2026-10-17T17:05:00.000Z')
})
