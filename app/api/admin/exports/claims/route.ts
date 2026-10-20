import { prisma } from '../../../../../src/lib/prisma'
import { requireAdmin } from '../../../../../src/lib/require-admin'
import { jakartaDateParts } from '../../../../../src/domain'
import { testSources } from '../../../../../src/lib/birthday-recipient-eligibility'
import { displayPhone, toCsv } from '../../../../../src/lib/csv'

export const runtime = 'nodejs'

const channels = { whatsapp: ['whatsapp_clicked'], web: ['link_clicked'], all: ['whatsapp_clicked', 'link_clicked'] } as const
const channelLabel: Record<string, string> = { whatsapp_clicked: 'WhatsApp (Claim)', link_clicked: 'Website' }
const isoDay = (date: Date) => { const parts = jakartaDateParts(date); return `${parts.year}-${parts.month}-${parts.day}` }
const wib = (date: Date | null) => date ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(date) : ''

// Customers who clicked the birthday email (default: Claim Your Birthday Treats) in a WIB date range, as CSV.
export async function GET(request: Request) {
  const { session, response } = await requireAdmin(request)
  if (response) return response
  const params = new URL(request.url).searchParams
  const today = isoDay(new Date())
  const from = params.get('from') || isoDay(new Date(Date.now() - 29 * 86_400_000))
  const to = params.get('to') || today
  const channel = (params.get('channel') ?? 'whatsapp') as keyof typeof channels
  const start = new Date(`${from}T00:00:00+07:00`)
  const end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + 86_400_000)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())
    || end <= start || end.getTime() - start.getTime() > 366 * 86_400_000 || !(channel in channels)) {
    return Response.json({ error: 'Rentang tanggal (maks. 366 hari) atau kanal tidak valid.' }, { status: 400 })
  }

  const events = await prisma.deliveryEvent.findMany({
    where: { eventType: { in: [...channels[channel]] }, occurredAt: { gte: start, lt: end }, dispatch: { customer: { source: { notIn: testSources } } } },
    orderBy: { occurredAt: 'asc' },
    select: { eventType: true, occurredAt: true, dispatch: { select: { customerId: true, acceptedAt: true, customer: { select: { fullName: true, email: true, phone: true, city: true, countryCode: true, birthDate: true } } } } },
  })
  // One row per customer and channel: first click, number of clicks.
  const grouped = new Map<string, { event: typeof events[number]; clicks: number }>()
  for (const event of events) {
    const key = `${event.dispatch.customerId}|${event.eventType}`
    const entry = grouped.get(key)
    if (entry) entry.clicks += 1
    else grouped.set(key, { event, clicks: 1 })
  }
  const rows = [...grouped.values()].map(({ event, clicks }) => {
    const customer = event.dispatch.customer
    return [customer.fullName ?? '', customer.email, displayPhone(customer.phone), customer.phone?.startsWith('+') ? `https://wa.me/${customer.phone.slice(1)}` : '',
      customer.city ?? '', customer.countryCode ?? '', customer.birthDate.toISOString().slice(0, 10), channelLabel[event.eventType], wib(event.occurredAt), clicks, wib(event.dispatch.acceptedAt)]
  })
  await prisma.auditLog.create({ data: { actor: session.user.id, action: 'export.claims', entityType: 'export', details: { from, to, channel, rows: rows.length } } })

  const csv = toCsv([['Nama', 'Email', 'No HP', 'Link WhatsApp', 'Kota', 'Negara', 'Tanggal lahir', 'Kanal', 'Klik pertama (WIB)', 'Jumlah klik', 'Email dikirim (WIB)'], ...rows])
  return new Response(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="klaim-birthday-${from}-${to}.csv"`,
    'Cache-Control': 'no-store',
  } })
}
