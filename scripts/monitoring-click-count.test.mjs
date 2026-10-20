import assert from 'node:assert/strict'
import test from 'node:test'
import { countUniqueClickedCustomers } from '../src/lib/monitoring-click-count.ts'

test('counts clicked customers once even when multiple dispatches were clicked', () => {
  assert.equal(countUniqueClickedCustomers([
    { customerId: 'a', clicked: true },
    { customerId: 'a', clicked: true },
    { customerId: 'b', clicked: false },
    { customerId: 'c', clicked: true },
  ]), 2)
})
