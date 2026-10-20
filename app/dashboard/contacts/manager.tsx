'use client'

import { useEffect, useState } from 'react'
import { calculateAge, flagPotentialDuplicateRows, inferColumnMapping, normalizeImportRows, parseDelimitedFile, parseSanghyangTextReport, type ImportMapping, type ImportRow } from '../../../src/domain'

async function parse(response: Response) { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Permintaan gagal.'); return data }

const PAGE_SIZE = 100
type SortKey = 'name' | 'age' | 'birthDate' | 'email' | 'city' | 'status' | 'createdAt'
const sortableColumns: { key: SortKey; label: string }[] = [{ key: 'name', label: 'Nama' }, { key: 'age', label: 'Umur' }, { key: 'birthDate', label: 'Tanggal lahir' }, { key: 'email', label: 'Email' }, { key: 'city', label: 'Kota' }, { key: 'status', label: 'Antrean' }]
const emailStatusLabel = (status: ImportRow['emailStatus']) => ({
  VALID: 'Format valid',
  SUSPECTED_TYPO: 'Kemungkinan typo',
  NEEDS_REVIEW: 'Perlu ditinjau',
  INVALID: 'Tidak valid',
  DUMMY: 'Email dummy',
  UNKNOWN: 'Email kosong',
})[status]

export default function ContactsManager() {
  const [rows, setRows] = useState<ImportRow[]>([])
  const [mapping, setMapping] = useState<ImportMapping>({ name: -1, birthDate: -1, email: -1 })
  const [headers, setHeaders] = useState<string[]>([])
  const [parsed, setParsed] = useState<ReturnType<typeof parseDelimitedFile> | null>(null)
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [importProgress, setImportProgress] = useState<{ completed: number; total: number } | null>(null)
  const [previewPage, setPreviewPage] = useState(1)
  const [customerPage, setCustomerPage] = useState(1)
  const [duplicatePage, setDuplicatePage] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [duplicateRows, setDuplicateRows] = useState<{ fullName: string | null; email: string; birthDate: string; recordNumber: number | null }[]>([])
  const [customerRows, setCustomerRows] = useState<{ id: string; fullName: string | null; birthDate: string; email: string; phone: string | null; city: string | null; countryCode: string | null; isBlacklisted: boolean }[]>([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' })
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  async function refresh(page = customerPage) {
    setLoadingCustomers(true)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), sort: sort.key, dir: sort.dir })
      if (query.trim()) params.set('q', query.trim())
      const data = await parse(await fetch(`/api/admin/customers?${params}`, { cache: 'no-store' }))
      setCustomerRows(data.customers)
      setTotalCustomers(data.total)
      setCustomerPage(data.page)
    } finally { setLoadingCustomers(false) }
  }

  // Search waits for a short pause in typing; sorting and searching start again from page 1.
  useEffect(() => {
    const timer = setTimeout(() => { refresh(1).catch((error) => setMessage(error.message)) }, 300)
    return () => clearTimeout(timer)
  }, [query, sort])

  function toggleSort(key: SortKey) {
    setSort((current) => current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  async function importAllRows(allRows: ImportRow[], sourceName: string) {
    const importable = allRows.filter((row) => row.selected && row.status === 'VALID')
    if (!importable.length) { setMessage('Tidak ada kontak valid untuk disimpan. Periksa pemetaan nama, tanggal lahir, dan email.'); return }
    const total = Math.ceil(importable.length / 5000)
    let completed = 0
    setBusy(true); setMessage(''); setDuplicateRows([]); setDuplicatePage(1); setImportProgress({ completed, total })
    try {
      let imported = 0
      let rejected = 0
      let notAccepted = 0
      let queued = 0
      let inactiveByAge = 0
      const duplicates: typeof duplicateRows = []
      for (let offset = 0; offset < importable.length; offset += 5000) {
        const data = await parse(await fetch('/api/admin/imports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: sourceName, rows: importable.slice(offset, offset + 5000) }) }))
        duplicates.push(...(data.duplicates ?? []))
        queued += data.queuedCount ?? 0
        inactiveByAge += data.inactiveByAge ?? 0
        rejected += data.duplicates?.length ?? 0
        notAccepted += Math.max(0, data.batch.rejectedCount - (data.duplicates?.length ?? 0))
        if (!data.alreadyProcessed) {
          imported += data.batch.importedCount
        }
        completed += 1
        setImportProgress({ completed, total })
      }
      setDuplicateRows(duplicates)
      setMessage(`Impor selesai: ${imported.toLocaleString('id-ID')} kontak baru tersimpan; ${queued.toLocaleString('id-ID')} jadwal masuk antrean; ${rejected.toLocaleString('id-ID')} baris duplikat sudah tercatat${notAccepted ? `; ${notAccepted.toLocaleString('id-ID')} baris tidak memenuhi syarat` : ''}${inactiveByAge ? `; ${inactiveByAge.toLocaleString('id-ID')} kontak usia 80+ disimpan nonaktif` : ''}. Duplikat berarti kontak sudah ada, bukan bukti repeat order.`)
      setImportProgress(null); setRows([]); setParsed(null); setHeaders([]); setFileName(''); setPreviewPage(1)
      await refresh(1)
    } catch (error) {
      setMessage(`${error instanceof Error ? error.message : 'Impor gagal.'}${completed ? ` ${Math.min(completed * 5000, importable.length).toLocaleString('id-ID')} dari ${importable.length.toLocaleString('id-ID')} kontak sudah diproses. Pilih file yang sama lagi untuk melanjutkan; data yang sudah tersimpan tidak akan digandakan.` : ''}`)
    } finally { setBusy(false) }
  }

  async function readFile(file?: File) {
    if (!file) return
    setBusy(true); setMessage(''); setImportProgress(null); setDuplicateRows([]); setDuplicatePage(1)
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('File maksimal 5 MB.')
      const buffer = await file.arrayBuffer()
      let content: string
      try { content = new TextDecoder('utf-8', { fatal: true }).decode(buffer) } catch { content = new TextDecoder('windows-1252').decode(buffer) }
      const parsedFile = file.name.toLowerCase().endsWith('.txt') ? parseSanghyangTextReport(content) : parseDelimitedFile(content)
      const inferred = inferColumnMapping(parsedFile.headers)
      const normalizedRows = flagPotentialDuplicateRows(normalizeImportRows(parsedFile, inferred))
      setFileName(file.name); setHeaders(parsedFile.headers); setParsed(parsedFile); setMapping(inferred); setRows(normalizedRows); setPreviewPage(1)
      if ([inferred.name, inferred.birthDate, inferred.email].every((index) => index >= 0)) await importAllRows(normalizedRows, file.name)
      else setMessage('File terbaca. Pilih kolom nama, tanggal lahir, dan email agar semua kontak bisa disimpan otomatis.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'File gagal dibaca.'); setRows([]); setParsed(null); setHeaders([]); setFileName('') }
    finally { setBusy(false) }
  }

  async function setColumn(column: keyof ImportMapping, index: number) {
    const next = { ...mapping, [column]: index }
    setMapping(next)
    if (parsed) {
      const nextRows = flagPotentialDuplicateRows(normalizeImportRows(parsed, next))
      setRows(nextRows)
      if ([next.name, next.birthDate, next.email].every((value) => value >= 0)) await importAllRows(nextRows, fileName)
    }
  }

  async function setBlacklisted(customer: typeof customerRows[number]) {
    setBusy(true); setMessage('')
    try {
      const data = await parse(await fetch('/api/admin/customers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: customer.id, isBlacklisted: !customer.isBlacklisted }) }))
      await refresh(); setMessage(customer.isBlacklisted ? `${data.queuedCount} jadwal masuk antrean.` : 'Kontak dikecualikan dari antrean berikutnya.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Status kontak gagal diubah.') } finally { setBusy(false) }
  }

  const previewPageCount = Math.ceil(rows.length / PAGE_SIZE)
  const customerPageCount = Math.ceil(totalCustomers / PAGE_SIZE)
  const duplicatePageCount = Math.ceil(duplicateRows.length / PAGE_SIZE)

  return <main className="manage-page"><header><h1>Daftar kontak</h1><p>Umur dihitung otomatis dari tanggal lahir. Impor menyimpan semua kontak valid ke database dan melewati duplikat.</p></header>
    <section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">BAGIAN 1</span><h2>Import data</h2></div></div><p>Pilih file CSV/TSV atau laporan tamu hotel (.txt). No HP dan kota ikut tersimpan bila ada di file. Kontak tersimpan otomatis setelah file terbaca.</p><label className="upload-label">Pilih file kontak<input type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; e.currentTarget.value = ''; void readFile(file) }} /></label>
      {headers.length > 0 && <div className="manage-grid">{(['name', 'birthDate', 'email', 'phone', 'city'] as const).map((column) => <label key={column}>{({ name: 'Kolom nama', birthDate: 'Kolom tanggal lahir', email: 'Kolom email', phone: 'Kolom No HP (opsional)', city: 'Kolom kota (opsional)' })[column]}<select value={mapping[column] ?? -1} disabled={busy} onChange={(e) => setColumn(column, Number(e.target.value))}><option value={-1}>Pilih kolom</option>{headers.map((header, index) => <option key={`${header}-${index}`} value={index}>{header || `Kolom ${index + 1}`}</option>)}</select></label>)}</div>}
      {rows.length > 0 && <><p className="manage-hint">{rows.filter((row) => row.status === 'VALID').length.toLocaleString('id-ID')} kontak valid · umur dihitung otomatis.</p><div className="table-scroll"><table><thead><tr><th>Nama</th><th>Tanggal lahir</th><th>Umur</th><th>Email</th><th>Status email</th><th>Kota</th><th>No HP</th></tr></thead><tbody>{rows.slice((previewPage - 1) * PAGE_SIZE, previewPage * PAGE_SIZE).map((row) => <tr key={row.recordNumber}><td>{row.fullName || '—'}</td><td>{row.birthDate || '—'}</td><td>{calculateAge(row.birthDate) ?? '—'}</td><td>{row.rawEmail || '—'}</td><td>{emailStatusLabel(row.emailStatus)}</td><td>{row.city || '—'}</td><td>{row.phone || '—'}</td></tr>)}</tbody></table></div><div className="contacts-pagination"><span>Pratinjau {((previewPage - 1) * PAGE_SIZE) + 1}–{Math.min(previewPage * PAGE_SIZE, rows.length)} dari {rows.length.toLocaleString('id-ID')}</span><button className="outline-button" disabled={previewPage <= 1} onClick={() => setPreviewPage((page) => page - 1)}>Sebelumnya</button><span>Halaman {previewPage} dari {previewPageCount}</span><button className="outline-button" disabled={previewPage >= previewPageCount} onClick={() => setPreviewPage((page) => page + 1)}>Berikutnya</button></div></>}
      {importProgress && <div className="import-progress" role="status" aria-live="polite"><span>{`Menyimpan bagian ${Math.min(importProgress.completed + 1, importProgress.total)} dari ${importProgress.total}...`}</span><progress max={importProgress.total} value={importProgress.completed} /></div>}
    </section>
    {message && <p className="manage-message" role="status">{message}</p>}
    {duplicateRows.length > 0 && <section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">HASIL IMPOR</span><h2>Kontak duplikat / sudah tercatat <span className="count-pill">{duplicateRows.length.toLocaleString('id-ID')}</span></h2></div></div><p>Baris ini dilewati karena kontaknya sudah ada di database. Ini tidak menunjukkan riwayat repeat order.</p><div className="table-scroll"><table><thead><tr><th>Nama</th><th>Umur</th><th>Tanggal lahir</th><th>Email</th><th>Status</th></tr></thead><tbody>{duplicateRows.slice((duplicatePage - 1) * PAGE_SIZE, duplicatePage * PAGE_SIZE).map((contact, index) => <tr key={`${contact.recordNumber ?? 'row'}-${index}`}><td>{contact.fullName || '—'}</td><td>{calculateAge(contact.birthDate) ?? '—'}</td><td>{contact.birthDate}</td><td>{contact.email}</td><td>Sudah tercatat</td></tr>)}</tbody></table></div>{duplicatePageCount > 1 && <div className="contacts-pagination"><span>Baris {((duplicatePage - 1) * PAGE_SIZE) + 1}–{Math.min(duplicatePage * PAGE_SIZE, duplicateRows.length)} dari {duplicateRows.length.toLocaleString('id-ID')}</span><button className="outline-button" disabled={duplicatePage <= 1} onClick={() => setDuplicatePage((page) => page - 1)}>Sebelumnya</button><span>Halaman {duplicatePage} dari {duplicatePageCount}</span><button className="outline-button" disabled={duplicatePage >= duplicatePageCount} onClick={() => setDuplicatePage((page) => page + 1)}>Berikutnya</button></div>}</section>}
    <section className="manage-card"><div className="manage-card-heading"><div><span className="eyebrow">BAGIAN 2</span><h2>Daftar kontak tersimpan <span className="count-pill">{totalCustomers.toLocaleString('id-ID')}</span></h2></div></div><p>Klik judul kolom untuk mengurutkan. Cari berdasarkan nama, email, kota, atau No HP.</p><label className="contacts-search">Cari kontak<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nama, email, kota, atau No HP" maxLength={120} /></label><div className="table-scroll" aria-busy={loadingCustomers}><table><thead><tr>{sortableColumns.map((column) => <th key={column.key} aria-sort={sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}><button type="button" className="sort-button" onClick={() => toggleSort(column.key)}>{column.label}<span aria-hidden="true">{sort.key === column.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ' ↕'}</span></button></th>)}<th>Aksi</th></tr></thead><tbody>{customerRows.map((customer) => <tr key={customer.id}><td>{customer.fullName || '—'}</td><td>{calculateAge(customer.birthDate.slice(0, 10)) ?? '—'}</td><td>{customer.birthDate.slice(0, 10)}</td><td>{customer.email}<small className="table-detail">{customer.phone || 'No HP —'}</small></td><td>{customer.city || '—'}</td><td>{customer.isBlacklisted ? 'Dikecualikan' : 'Aktif'}</td><td><button className="outline-button" disabled={busy} onClick={() => setBlacklisted(customer)}>{customer.isBlacklisted ? 'Izinkan kembali' : 'Kecualikan'}</button></td></tr>)}</tbody></table>{!totalCustomers && !loadingCustomers && <p>{query.trim() ? `Tidak ada kontak yang cocok dengan “${query.trim()}”.` : 'Belum ada kontak di database Birthday Automation.'}</p>}</div>{customerPageCount > 1 && <div className="contacts-pagination"><span>Kontak {((customerPage - 1) * PAGE_SIZE) + 1}–{Math.min(customerPage * PAGE_SIZE, totalCustomers)} dari {totalCustomers.toLocaleString('id-ID')}</span><button className="outline-button" disabled={busy || customerPage <= 1} onClick={() => refresh(customerPage - 1)}>Sebelumnya</button><span>Halaman {customerPage} dari {customerPageCount}</span><button className="outline-button" disabled={busy || customerPage >= customerPageCount} onClick={() => refresh(customerPage + 1)}>Berikutnya</button></div>}</section>
  </main>
}
