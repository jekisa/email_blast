import { prisma } from '../../../../src/lib/prisma'
import { forecastSends } from '../../../../src/lib/birthday-forecast'
import { testSources } from '../../../../src/lib/birthday-recipient-eligibility'
import { requireAdmin } from '../../../../src/lib/require-admin'
import { jakartaDateParts } from '../../../../src/domain'
import { countUniqueClickedCustomers } from '../../../../src/lib/monitoring-click-count'

export async function GET(request: Request) {
  const { response } = await requireAdmin(request)
  if (response) return response
  const calendar = jakartaDateParts()
  const searchParams = new URL(request.url).searchParams
  const requestedMonth = searchParams.get('month')
  const monthMatch = requestedMonth?.match(/^(\d{4})-(0[1-9]|1[0-2])$/)
  const year = Number(monthMatch?.[1] ?? calendar.year)
  const month = Number(monthMatch?.[2] ?? calendar.month)
  const monthStart = new Date(Date.UTC(year, month - 1, 1) - 7 * 60 * 60 * 1000)
  const nextMonth = new Date(Date.UTC(year, month, 1) - 7 * 60 * 60 * 1000)
  const actualThisMonth = await prisma.birthdayDispatch.findMany({
    where: { scheduledAt: { gte: monthStart, lt: nextMonth }, customer: { source: { notIn: testSources } } },
    orderBy: { scheduledAt: 'asc' },
    include: {
      customer: { select: { fullName: true, email: true, source: true } },
      campaign: { select: { id: true, name: true, whatsappPhone: true } },
      events: { orderBy: { occurredAt: 'asc' }, where: { eventType: { in: ['smtp_accepted', 'smtp_rejected', 'send_error', 'link_clicked', 'whatsapp_clicked'] } }, select: { eventType: true, occurredAt: true, smtpMessageId: true } },
    },
  })
  const monthlyDispatches = actualThisMonth.map((dispatch) => ({
    id: dispatch.id,
    campaignId: dispatch.campaignId,
    customerId: dispatch.customerId,
    birthdayYear: dispatch.birthdayYear,
    scheduledAt: dispatch.scheduledAt,
    status: dispatch.status,
    acceptedAt: dispatch.acceptedAt,
    errorMessage: dispatch.errorMessage,
    customer: dispatch.customer,
    campaign: { id: dispatch.campaign.id, name: dispatch.campaign.name, whatsappConfigured: Boolean(dispatch.campaign.whatsappPhone) },
    clickedAt: dispatch.events.find((event) => event.eventType === 'link_clicked')?.occurredAt ?? null,
    whatsappClickedAt: dispatch.events.find((event) => event.eventType === 'whatsapp_clicked')?.occurredAt ?? null,
  }))
  // Upcoming sends from today onward that the cron has not queued yet, so the calendar shows contacts per date.
  const todayIso = `${calendar.year}-${calendar.month}-${calendar.day}`
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`
  const monthStartIso = `${monthPrefix}-01`
  const monthEndIso = `${monthPrefix}-${String(new Date(Date.UTC(year, month, 0)).getUTCDate()).padStart(2, '0')}`
  for (const row of await forecastSends(monthStartIso > todayIso ? monthStartIso : todayIso, monthEndIso)) {
    monthlyDispatches.push({
      id: `forecast:${row.campaignId}:${row.customerId}:${row.birthdayYear}`,
      campaignId: row.campaignId,
      customerId: row.customerId,
      birthdayYear: row.birthdayYear,
      scheduledAt: row.scheduledAt,
      status: 'scheduled',
      acceptedAt: null,
      errorMessage: null,
      customer: { fullName: row.customer.full_name, email: row.customer.email.trim(), source: row.customer.source },
      campaign: { id: row.campaign.id, name: row.campaign.name, whatsappConfigured: Boolean(row.campaign.whatsappPhone) },
      clickedAt: null,
      whatsappClickedAt: null,
    })
  }
  monthlyDispatches.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime() || (a.customer.fullName ?? '').localeCompare(b.customer.fullName ?? ''))
  const clickedCustomerCount = countUniqueClickedCustomers(actualThisMonth.map((dispatch) => ({
    customerId: dispatch.customerId,
    clicked: dispatch.events.some((event) => event.eventType === 'link_clicked'),
  })))
  const whatsappClickedCustomerCount = countUniqueClickedCustomers(actualThisMonth.map((dispatch) => ({
    customerId: dispatch.customerId,
    clicked: dispatch.events.some((event) => event.eventType === 'whatsapp_clicked'),
  })))
  return Response.json({ monthlyDispatches, clickedCustomerCount, whatsappClickedCustomerCount }, { headers: { 'Cache-Control': 'no-store' } })
}
