'use client'

import { useEffect, useMemo, useState } from 'react'

type MonthlyRow = {
  id: string
  campaignId: string
  customerId: string
  scheduledAt: string
  status: string
  acceptedAt: string | null
  errorMessage: string | null
  clickedAt: string | null
  whatsappClickedAt: string | null
  customer: { fullName: string | null; email: string }
  campaign: { id: string; name: string; whatsappConfigured: boolean }
}

const labels: Record<string, string> = {
  scheduled: 'Terjadwal', queued: 'Antrean', processing: 'Sedang diproses',
  accepted: 'Diterima SMTP', rejected: 'Gagal', error: 'Gagal', cancelled: 'Dibatalkan',
}
const jakarta = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('id-ID', { ...options, timeZone: 'Asia/Jakarta' }).format(date)
const monthKeyNow = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Jakarta' }).formatToParts(new Date())
  return `${parts.find((part) => part.type === 'year')?.value}-${parts.find((part) => part.type === 'month')?.value}`
}
const dateKey = (date: Date) => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' }).format(date)
const dateLabel = (value: string | null) => value ? jakarta(new Date(value), { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function Monitoring() {
  const [rows, setRows] = useState<MonthlyRow[]>([])
  const [clickedCustomerCount, setClickedCustomerCount] = useState(0)
  const [whatsappClickedCustomerCount, setWhatsappClickedCustomerCount] = useState(0)
  const [month, setMonth] = useState(monthKeyNow)
  const [selectedDate, setSelectedDate] = useState('')
  const [page, setPage] = useState(0)
  const [message, setMessage] = useState('Memuat monitoring...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setMessage('Memuat monitoring...')
    setLoading(true)
    fetch(`/api/admin/dispatches?month=${month}`, { cache: 'no-store' }).then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Monitoring gagal dimuat.')
      if (!active) return
      const nextRows = data.monthlyDispatches as MonthlyRow[]
      setRows(nextRows)
      setClickedCustomerCount(data.clickedCustomerCount)
      setWhatsappClickedCustomerCount(data.whatsappClickedCustomerCount)
      setSelectedDate((previous) => nextRows.some((row) => dateKey(new Date(row.scheduledAt)) === previous) ? previous : nextRows[0] ? dateKey(new Date(nextRows[0].scheduledAt)) : `${month}-01`)
      setMessage(nextRows.length ? '' : 'Belum ada jadwal ulang tahun untuk bulan ini.')
    }).catch((error: unknown) => { if (active) setMessage(error instanceof Error ? error.message : 'Monitoring gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [month])
  useEffect(() => setPage(0), [selectedDate])

  const [year, monthNumber] = month.split('-').map(Number)
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const firstWeekday = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7
  const groupedRows = useMemo(() => {
    const grouped = new Map<string, MonthlyRow[]>()
    for (const row of rows) {
      const key = dateKey(new Date(row.scheduledAt))
      grouped.set(key, [...(grouped.get(key) ?? []), row])
    }
    return grouped
  }, [rows])
  const selectedRows = groupedRows.get(selectedDate) ?? []
  const pageSize = 25
  const pageCount = Math.ceil(selectedRows.length / pageSize)
  const visibleRows = selectedRows.slice(page * pageSize, (page + 1) * pageSize)
  const monthDate = new Date(Date.UTC(year, monthNumber - 1, 15, 12))
  const monthLabel = jakarta(monthDate, { month: 'long', year: 'numeric' })

  function shiftMonth(amount: number) {
    const shifted = new Date(Date.UTC(year, monthNumber - 1 + amount, 1))
    setMonth(`${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`)
  }

  return <main className="manage-page">{loading && <div className="page-loading-bar" role="progressbar" aria-label="Memuat data monitoring" />}<header><h1>Monitoring email</h1><p>Kalender menampilkan jumlah customer yang akan dikirimi email per tanggal kirim, beserta status pengiriman yang tercatat. Diterima SMTP berarti server menerima pesan, bukan bukti email masuk inbox.</p></header>
    <div className="monitoring-click-summary"><section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">TAUTAN SANGHYANG</span><h2>Klik {monthLabel}</h2></div><span className="count-pill">{clickedCustomerCount}</span></div><p>Pelanggan unik yang mengeklik tautan Sanghyang. Pemindai keamanan email juga dapat tercatat.</p></section><section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">WHATSAPP</span><h2>Klik {monthLabel}</h2></div><span className="count-pill">{whatsappClickedCustomerCount}</span></div><p>Pelanggan unik yang mengeklik tombol WhatsApp. Ini tidak memastikan pesan dikirim.</p></section></div>
    <section className={`manage-card birthday-calendar-section${loading ? ' is-loading' : ''}`} aria-busy={loading}>
      <div className="manage-card-heading"><div><span className="eyebrow">JADWAL PENGIRIMAN</span><h2>Kalender ulang tahun</h2></div><div className="calendar-month-controls"><button type="button" className="outline-button" aria-label="Bulan sebelumnya" onClick={() => shiftMonth(-1)}>Sebelumnya</button><strong>{monthLabel}</strong>{loading && <span className="loading-label" aria-hidden="true">Memuat…</span>}<button type="button" className="outline-button" aria-label="Bulan berikutnya" onClick={() => shiftMonth(1)}>Berikutnya</button></div></div>
      <div className="birthday-calendar" role="grid" aria-label={`Kalender ulang tahun ${monthLabel}`}>
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => <div className="calendar-weekday" role="columnheader" key={day}>{day}</div>)}
        {Array.from({ length: firstWeekday }, (_, index) => <div className="calendar-empty" role="gridcell" key={`empty-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const key = `${month}-${String(day).padStart(2, '0')}`
          const dayRows = groupedRows.get(key) ?? []
          const accepted = dayRows.filter((row) => row.status === 'accepted').length
          const failed = dayRows.filter((row) => ['rejected', 'error'].includes(row.status)).length
          const upcoming = dayRows.filter((row) => ['scheduled', 'queued', 'processing'].includes(row.status)).length
          return <button type="button" role="gridcell" aria-pressed={selectedDate === key} aria-label={`${day} ${monthLabel}: ${dayRows.length} customer, ${upcoming} akan dikirim, ${accepted} diterima SMTP, ${failed} gagal`} className={`calendar-day${selectedDate === key ? ' selected' : ''}${dayRows.length ? ' has-birthdays' : ''}`} key={key} onClick={() => setSelectedDate(key)}>
            <span className="calendar-day-number">{day}</span>{dayRows.length > 0 && <><span className="calendar-day-count">{dayRows.length} customer</span><span className="calendar-day-status">{upcoming === dayRows.length ? `${upcoming} akan dikirim` : `${accepted} diterima · ${failed} gagal${upcoming ? ` · ${upcoming} antre` : ''}`}</span></>}
          </button>
        })}
      </div>
      <div className="calendar-legend"><span><i className="calendar-dot scheduled" />Antrean</span><span><i className="calendar-dot accepted" />Diterima SMTP</span><span><i className="calendar-dot failed" />Gagal</span></div>
    </section>
    <section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">{selectedDate ? jakarta(new Date(`${selectedDate}T12:00:00+07:00`), { dateStyle: 'full' }) : 'DETAIL TANGGAL'}</span><h2>Daftar penerima</h2></div><span className="count-pill">{selectedRows.length}</span></div>
      {message && <p role="status">{message}</p>}
      {!message && selectedRows.length === 0 && <p>Tidak ada customer yang ulang tahun pada tanggal ini.</p>}
      {selectedRows.length > 0 && <><div className="table-scroll"><table><thead><tr><th>Kontak</th><th>Campaign</th><th>Jadwal WIB</th><th>Status pengiriman</th><th>Klik Sanghyang</th><th>Klik WhatsApp</th></tr></thead><tbody>{visibleRows.map((row) => <tr key={row.id}><td>{row.customer.fullName || row.customer.email}<small className="table-detail">{row.customer.email}</small></td><td>{row.campaign.name}</td><td>{dateLabel(row.scheduledAt)}</td><td><strong>{labels[row.status] ?? row.status}</strong>{row.acceptedAt && <small className="table-detail">Diterima SMTP · {dateLabel(row.acceptedAt)}</small>}{row.errorMessage && <small className="table-detail">{row.errorMessage}</small>}</td><td>{row.clickedAt ? `Diklik · ${dateLabel(row.clickedAt)}` : row.status === 'accepted' ? 'Belum diklik' : '—'}</td><td>{!row.campaign.whatsappConfigured ? 'Tidak diatur' : row.whatsappClickedAt ? `Diklik · ${dateLabel(row.whatsappClickedAt)}` : row.status === 'accepted' ? 'Belum diklik' : '—'}</td></tr>)}</tbody></table></div><div className="recipient-pagination"><span>Menampilkan {page * pageSize + 1}–{Math.min((page + 1) * pageSize, selectedRows.length)} dari {selectedRows.length} penerima</span><button type="button" className="outline-button" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>Sebelumnya</button><span>Halaman {page + 1} dari {pageCount}</span><button type="button" className="outline-button" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => current + 1)}>Berikutnya</button></div></>}
    </section>
  </main>
}
