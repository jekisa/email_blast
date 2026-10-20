export function countUniqueClickedCustomers(rows: readonly { customerId: string; clicked: boolean }[]) {
  return new Set(rows.filter((row) => row.clicked).map((row) => row.customerId)).size
}
