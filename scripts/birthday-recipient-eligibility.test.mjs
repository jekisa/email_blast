import assert from 'node:assert/strict'
import test from 'node:test'
import { correctBirthdayEmail, isEligibleBirthdayRecipient } from '../src/lib/birthday-recipient-eligibility.ts'

test('fixes misspelt webmail domains and leaves unclear or valid ones alone', () => {
  const cases = {
    'Budi.S@gmial.com': 'Budi.S@gmail.com', 'a@gamil.com': 'a@gmail.com', 'a@gmai.com': 'a@gmail.com', 'a@gmail.comm': 'a@gmail.com',
    'a@gmail.cm': 'a@gmail.com', 'a@yaho.com': 'a@yahoo.com', 'a@yahoo.coid': 'a@yahoo.co.id', 'a@yaho.co.id': 'a@yahoo.co.id', 'a@hotmial.com': 'a@hotmail.com',
    'a@yahoo.co.com': 'a@yahoo.com', 'a@yahoo.co.id': 'a@yahoo.co.id', ' a@gmail.com ': 'a@gmail.com', 'a@ymail.com': 'a@ymail.com', 'a@bahana.co.id': 'a@bahana.co.id',
  }
  for (const [input, expected] of Object.entries(cases)) assert.equal(correctBirthdayEmail(input), expected, input)
})

test('allows active, valid customer contacts to receive birthday emails', () => {
  assert.equal(isEligibleBirthdayRecipient(' customer@example.com ', true, false), true)
})

test('blocks inactive, blacklisted, invalid, and dummy contacts', () => {
  assert.equal(isEligibleBirthdayRecipient('customer@example.com', false, false), false)
  assert.equal(isEligibleBirthdayRecipient('customer@example.com', true, true), false)
  assert.equal(isEligibleBirthdayRecipient('bad-email', true, false), false)
  assert.equal(isEligibleBirthdayRecipient('dummy@example.com', true, false), false)
})

test('blocks misspelt webmail domains but keeps real providers and company domains', () => {
  for (const email of ['a@gamil.com', 'a@gnail.com', 'a@gmail.comm', 'a@gmial.com', 'a@gmai.com', 'a@yahoo.co.com', 'a@yaho.com', 'a@hotmial.com'])
    assert.equal(isEligibleBirthdayRecipient(email, true, false), false, email)
  for (const email of ['a@gmail.com', 'a@ymail.com', 'a@mail.com', 'a@yahoo.co.id', 'a@rocketmail.com', 'a@yahoo.co.jp', 'a@yahoo.com.sg', 'a@bahana.co.id', 'a@163.com', 'a@sanghyang.com'])
    assert.equal(isEligibleBirthdayRecipient(email, true, false), true, email)
})
