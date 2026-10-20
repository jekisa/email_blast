import { birthdaySchedule } from '../domain'
import { isUsableBirthdayEmail } from './birthday-recipient-eligibility'

type Customer = { id: string; email: string; birthDate: Date }
type Campaign = { id: string; sendOffsetDays: number; sendTime: Date; promoId?: string | null }

// Month/day pairs whose birthday sends on todayIso (YYYY-MM-DD) for the offsets; Feb 29 sends with Feb 28 in non-leap years.
export function birthdaysSendingOn(todayIso: string, offsetDays: number[]) {
  return offsetDays.flatMap((offset) => {
    const birthday = new Date(Date.parse(`${todayIso}T00:00:00.000Z`) - offset * 86_400_000)
    const year = birthday.getUTCFullYear()
    const month = birthday.getUTCMonth() + 1
    const day = birthday.getUTCDate()
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    return month === 2 && day === 28 && !leap ? [[2, 28], [2, 29]] : [[month, day]]
  })
}

export function buildBirthdayDispatchRows(customers: Customer[], campaigns: Campaign[], now = new Date()) {
  return customers.flatMap((customer) => {
    if (!isUsableBirthdayEmail(customer.email)) return []
    return campaigns.flatMap((campaign) => {
      const schedule = birthdaySchedule(customer.birthDate.toISOString().slice(0, 10), campaign.sendOffsetDays, now)
      if (!schedule) return []
      const time = campaign.sendTime.toISOString().slice(11, 16)
      return [{ customerId: customer.id, campaignId: campaign.id, promoId: campaign.promoId ?? null, birthdayYear: schedule.birthdayYear, scheduledAt: new Date(`${schedule.date}T${time}:00+07:00`) }]
    })
  })
}
