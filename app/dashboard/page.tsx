import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '../../src/lib/auth'
import { prisma } from '../../src/lib/prisma'
import { jakartaDateParts } from '../../src/domain'
import { forecastSends } from '../../src/lib/birthday-forecast'
import { testSources } from '../../src/lib/birthday-recipient-eligibility'
import ProblemList from './problem-list'
import { displayPhone } from '../../src/lib/csv'

export const dynamic = 'force-dynamic'

const stuckAfterMs = 10 * 60 * 1000
const isoDay = (date: Date) => { const parts = jakartaDateParts(date); return `${parts.year}-${parts.month}-${parts.day}` }
const jakartaLabel = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('id-ID', { ...options, timeZone: 'Asia/Jakarta' }).format(date)

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'admin') redirect('/login')

  const today = jakartaDateParts()
  const dayStart = new Date(`${today.year}-${today.month}-${today.day}T00:00:00+07:00`)
  const tomorrowStart = new Date(dayStart.getTime() + 86_400_000)
  const tomorrow = jakartaDateParts(tomorrowStart)
  const tomorrowIso = `${tomorrow.year}-${tomorrow.month}-${tomorrow.day}`
  const realCustomer = { source: { notIn: testSources } }
  const clickedToday = (eventType: string) => prisma.deliveryEvent.findMany({ where: { eventType, occurredAt: { gte: dayStart, lt: tomorrowStart }, dispatch: { customer: realCustomer } }, orderBy: { occurredAt: 'asc' }, select: { occurredAt: true, dispatch: { select: { customerId: true, customer: { select: { fullName: true, email: true, phone: true, city: true } } } } } })

  const [sentToday, whatsappClicks, webClicks, queuedTomorrow, upcomingTomorrow, problems] = await Promise.all([
    prisma.birthdayDispatch.count({ where: { status: 'accepted', acceptedAt: { gte: dayStart, lt: tomorrowStart }, customer: realCustomer } }),
    clickedToday('whatsapp_clicked'),
    clickedToday('link_clicked'),
    prisma.birthdayDispatch.count({ where: { status: 'queued', scheduledAt: { gte: tomorrowStart, lt: new Date(tomorrowStart.getTime() + 86_400_000) }, customer: realCustomer, campaign: { status: 'active' } } }),
    forecastSends(tomorrowIso, tomorrowIso),
    prisma.birthdayDispatch.findMany({
      where: { customer: realCustomer, OR: [{ status: { in: ['error', 'rejected'] } }, { status: 'processing', claimedAt: { lt: new Date(Date.now() - stuckAfterMs) } }] },
      orderBy: { scheduledAt: 'desc' },
      select: { id: true, status: true, scheduledAt: true, errorMessage: true, attemptCount: true, customer: { select: { fullName: true, email: true } }, events: { where: { eventType: 'smtp_accepted' }, select: { id: true }, take: 1 } },
    }),
  ])
  // First click per customer today, for the counts and the name lists.
  const clickers = (rows: Awaited<ReturnType<typeof clickedToday>>) => [...new Map(rows.map((row) => [row.dispatch.customerId, row])).values()].reverse()
    .map((row) => ({ id: row.dispatch.customerId, name: row.dispatch.customer.fullName || row.dispatch.customer.email, email: row.dispatch.customer.email, phone: displayPhone(row.dispatch.customer.phone), city: row.dispatch.customer.city ?? '', time: jakartaLabel(row.occurredAt, { timeStyle: 'short' }) }))
  const whatsappClickers = clickers(whatsappClicks)
  const webClickers = clickers(webClicks)

  return <main className="admin-content" id="dashboard">
    <div className="admin-heading"><div><span className="eyebrow">BIRTHDAY EMAIL</span><h1>Dashboard</h1><p>Hari ini, {jakartaLabel(dayStart, { dateStyle: 'full' })}.</p></div></div>
    <section className="admin-metrics" aria-label="Ringkasan hari ini">
      <article><span>Terkirim hari ini</span><strong>{sentToday.toLocaleString('id-ID')}</strong><small>email diterima server SMTP</small></article>
      <a className="metric-link whatsapp" href="#klik-whatsapp"><span>Klik WhatsApp hari ini</span><strong>{whatsappClickers.length.toLocaleString('id-ID')}</strong><small>customer unik · klik untuk lihat nama</small></a>
      <a className="metric-link" href="#klik-web"><span>Klik web hari ini</span><strong>{webClickers.length.toLocaleString('id-ID')}</strong><small>customer unik ke sanghyang.com · klik untuk lihat nama</small></a>
      <article><span>Besok</span><strong>{(queuedTomorrow + upcomingTomorrow.length).toLocaleString('id-ID')}</strong><small>customer, {jakartaLabel(tomorrowStart, { day: 'numeric', month: 'long' })} pukul 00.00 WIB</small></article>
      <a className={`metric-link${problems.length ? ' needs-attention' : ''}`} href="#perlu-diperiksa"><span>Perlu diperiksa</span><strong>{problems.length.toLocaleString('id-ID')}</strong><small>{problems.length ? 'klik untuk lihat kontak' : 'tidak ada masalah'}</small></a>
    </section>
    <ClickList id="klik-whatsapp" title="Klik WhatsApp hari ini" note="Customer yang menekan tombol Claim Your Birthday Treats. Ini tidak memastikan pesan WhatsApp terkirim." people={whatsappClickers} />
    <ClickList id="klik-web" title="Klik web hari ini" note="Customer yang membuka tautan sanghyang.com dari email. Pemindai keamanan email juga dapat tercatat." people={webClickers} />
    <section className="admin-panel" id="export-klaim"><div className="panel-heading"><div><h2>Export klaim</h2><p>Unduh daftar customer yang menekan Claim Your Birthday Treats (nama, email, No HP, kota, jam klik) sebagai CSV untuk Excel. No HP berasal dari data tamu hotel.</p></div></div>
      <form className="export-form" action="/api/admin/exports/claims" method="get">
        <label>Dari<input type="date" name="from" defaultValue={isoDay(new Date(dayStart.getTime() - 29 * 86_400_000))} required /></label>
        <label>Sampai<input type="date" name="to" defaultValue={isoDay(dayStart)} required /></label>
        <label>Kanal<select name="channel" defaultValue="whatsapp"><option value="whatsapp">Claim (WhatsApp)</option><option value="web">Website</option><option value="all">Keduanya</option></select></label>
        <button type="submit">Download CSV</button>
      </form>
    </section>
    <section className="admin-panel" id="perlu-diperiksa"><div className="panel-heading"><div><h2>Perlu diperiksa</h2><p>Pengiriman gagal atau terhenti. Kirim ulang hanya sekali, dan hanya jika SMTP belum pernah menerima email ini.</p></div><a href="/dashboard/monitoring">Buka monitoring</a></div>
      <ProblemList problems={problems.map((problem) => ({
        id: problem.id,
        name: problem.customer.fullName || problem.customer.email,
        email: problem.customer.email,
        date: jakartaLabel(problem.scheduledAt, { dateStyle: 'medium' }),
        reason: problem.status === 'processing' ? 'Terhenti saat diproses; hasil SMTP tidak diketahui.' : problem.errorMessage ?? 'SMTP tidak mengonfirmasi penerimaan.',
        canResend: !problem.events.length && problem.attemptCount < 2,
      }))} />
    </section>
  </main>
}

function ClickList({ id, title, note, people }: { id: string; title: string; note: string; people: { id: string; name: string; email: string; phone: string; city: string; time: string }[] }) {
  return <section className="admin-panel" id={id}><div className="panel-heading"><div><h2>{title} <span className="count-pill">{people.length}</span></h2><p>{note}</p></div></div>
    {people.length ? <div className="table-scroll"><table><thead><tr><th>Kontak</th><th>No HP</th><th>Kota</th><th>Jam klik (WIB)</th></tr></thead><tbody>{people.map((person) => <tr key={person.id}><td>{person.name}<small className="table-detail">{person.email}</small></td><td>{person.phone || '—'}</td><td>{person.city || '—'}</td><td>{person.time}</td></tr>)}</tbody></table></div> : <p>Belum ada klik hari ini.</p>}
  </section>
}

