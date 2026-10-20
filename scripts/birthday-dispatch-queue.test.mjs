import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import test from 'node:test'

registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(/^\.\.?\//.test(specifier) && !/\.\w+$/.test(specifier) ? `${specifier}.ts` : specifier, context)
} })

const { buildBirthdayDispatchRows } = await import('../src/lib/birthday-dispatch-queue.ts')

test('queues eligible customers at the campaign time in Jakarta and skips invalid or dummy emails', () => {
  const rows = buildBirthdayDispatchRows([
    { id: 'customer-1', email: ' valid@example.com ', birthDate: new Date('1990-10-20T00:00:00.000Z') },
    { id: 'customer-2', email: 'invalid-email', birthDate: new Date('1990-10-20T00:00:00.000Z') },
    { id: 'customer-3', email: 'dummy@example.com', birthDate: new Date('1990-10-20T00:00:00.000Z') },
  ], [{ id: 'campaign-1', sendOffsetDays: -7, sendTime: new Date('1970-01-01T01:15:00.000Z'), promoId: 'promo-1' }], new Date('2026-10-12T12:00:00.000Z'))

  assert.deepEqual(rows, [{
    customerId: 'customer-1',
    campaignId: 'campaign-1',
    promoId: 'promo-1',
    birthdayYear: 2026,
    scheduledAt: new Date('2026-10-12T18:15:00.000Z'),
  }])
})

test('birthdaysSendingOn matches birthdaySchedule for every birthday across year ends and Feb 29', async () => {
  const { birthdaysSendingOn } = await import('../src/lib/birthday-dispatch-queue.ts')
  const { birthdaySchedule } = await import('../src/domain.ts')
  const birthDates = Array.from({ length: 366 }, (_, index) => new Date(Date.UTC(2000, 0, 1 + index)).toISOString().slice(0, 10))
  for (const offset of [-7, 0]) {
    for (const [from, until] of [['2026-12-26', '2027-01-10'], ['2027-02-18', '2027-03-03'], ['2028-02-18', '2028-03-03']]) for (let time = Date.parse(from); time <= Date.parse(until); time += 86_400_000) {
      const todayIso = new Date(time).toISOString().slice(0, 10)
      const now = new Date(`${todayIso}T05:00:00.000Z`)
      const expected = birthDates.filter((birthDate) => birthdaySchedule(birthDate, offset, now)?.date === todayIso).map((birthDate) => birthDate.slice(5)).sort()
      const actual = birthdaysSendingOn(todayIso, [offset]).map(([month, day]) => `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`).sort()
      assert.deepEqual(actual, expected, `${todayIso} offset ${offset}`)
    }
  }
})
