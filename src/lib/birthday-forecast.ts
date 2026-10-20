import 'server-only'
import { Prisma } from '../generated/prisma/client'
import { prisma } from './prisma'
import { birthdaysSendingOn, buildBirthdayDispatchRows } from './birthday-dispatch-queue'
import { testSources } from './birthday-recipient-eligibility'

// Sends the cron will queue on Jakarta dates fromIso..toIso (inclusive, YYYY-MM-DD) that are not queued or sent yet.
export async function forecastSends(fromIso: string, toIso: string) {
  if (fromIso > toIso) return []
  const days: string[] = []
  for (let time = Date.parse(`${fromIso}T00:00:00.000Z`); time <= Date.parse(`${toIso}T00:00:00.000Z`); time += 86_400_000) days.push(new Date(time).toISOString().slice(0, 10))
  const campaigns = await prisma.campaign.findMany({ where: { status: 'active' }, select: { id: true, name: true, whatsappPhone: true, sendOffsetDays: true, sendTime: true } })
  if (!campaigns.length) return []
  const birthdays = [...new Set(days.flatMap((day) => birthdaysSendingOn(day, campaigns.map((campaign) => campaign.sendOffsetDays))).map(([month, day]) => `${month}-${day}`))].map((pair) => pair.split('-').map(Number))
  const customers = await prisma.$queryRaw<Array<{ id: string; full_name: string | null; email: string; birth_date: Date; source: string }>>(Prisma.sql`
    SELECT id, full_name, email, birth_date, source FROM customers
    WHERE is_active = true AND is_blacklisted = false AND source NOT IN (${Prisma.join(testSources)})
      AND (EXTRACT(MONTH FROM birth_date)::int, EXTRACT(DAY FROM birth_date)::int) IN (${Prisma.join(birthdays.map(([month, day]) => Prisma.sql`(${month}::int, ${day}::int)`))})
  `)
  if (!customers.length) return []
  const key = (row: { campaignId: string; customerId: string; birthdayYear: number }) => `${row.campaignId}:${row.customerId}:${row.birthdayYear}`
  const existing = new Set((await prisma.birthdayDispatch.findMany({ where: { customerId: { in: customers.map((customer) => customer.id) } }, select: { campaignId: true, customerId: true, birthdayYear: true } })).map(key))
  const customerById = new Map(customers.map((customer) => [customer.id, customer]))
  const campaignById = new Map(campaigns.map((campaign) => [campaign.id, campaign]))
  const until = new Date(Date.parse(`${toIso}T00:00:00+07:00`) + 86_400_000)
  return buildBirthdayDispatchRows(customers.map((customer) => ({ id: customer.id, email: customer.email, birthDate: customer.birth_date })), campaigns, new Date(`${fromIso}T00:00:00+07:00`))
    .filter((row) => row.scheduledAt < until && !existing.has(key(row)))
    .map((row) => ({ ...row, customer: customerById.get(row.customerId)!, campaign: campaignById.get(row.campaignId)! }))
}
