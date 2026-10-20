import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'
import {
  calculateAge, flagPotentialDuplicateRows, inferColumnMapping, normalizeBirthDate, normalizeEmail, normalizeImportRows, normalizeName, parseDelimitedFile,
  parseSanghyangTextReport, previewTemplate, scheduleDate,
  type Campaign, type Customer, type ImportMapping, type ImportRow, type ParsedFile, type Promo,
} from './domain'
import {
  clearLocalDatabase, commitImport, createPreviewDispatches, initializeLocalDatabase,
  loadWorkspace, saveCampaign, saveCustomer, savePromo, saveTemplateVersion,
} from './localDb'

type Workspace = Awaited<ReturnType<typeof loadWorkspace>>
type Page = 'Overview' | 'Customers' | 'Import data' | 'Campaign' | 'Email template' | 'Promo' | 'Send queue' | 'Monitoring'
type Mapping = ImportMapping
type CampaignForm = Pick<Campaign, 'name' | 'status' | 'sendOffsetDays' | 'sendTime'>
const nav: Page[] = ['Overview', 'Customers', 'Import data', 'Campaign', 'Email template', 'Promo', 'Send queue', 'Monitoring']

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [search, setSearch] = useState('')
  const [emailFilter, setEmailFilter] = useState<'ALL' | 'VALID' | 'INVALID' | 'EMPTY'>('ALL')
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editValues, setEditValues] = useState({ fullName: '', birthDate: '', email: '' })
  const [editError, setEditError] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [fileName, setFileName] = useState('')
  const [fileHash, setFileHash] = useState('')
  const [mapping, setMapping] = useState<Mapping>({ name: -1, birthDate: -1, email: -1 })
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null)
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({ name: '', status: 'DRAFT', sendOffsetDays: -7, sendTime: '00:00' })
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateBody, setTemplateBody] = useState('')
  const [promoTitle, setPromoTitle] = useState('')
  const [promoDescription, setPromoDescription] = useState('')
  const [promoCodePrefix, setPromoCodePrefix] = useState('')

  const refresh = async () => {
    const next = await loadWorkspace()
    setWorkspace(next)
    const campaign = next.campaigns[0]
    if (campaign) {
      setCampaignForm({ name: campaign.name, status: campaign.status, sendOffsetDays: campaign.sendOffsetDays, sendTime: campaign.sendTime })
      const template = next.templates.find((item) => item.id === campaign.activeTemplateId)
      if (template) { setTemplateSubject(template.subject); setTemplateBody(template.body) }
      const promo = next.promos.find((item) => item.id === campaign.activePromoId)
      if (promo) { setPromoTitle(promo.title); setPromoDescription(promo.description); setPromoCodePrefix(promo.codePrefix) }
    }
  }
  useEffect(() => { initializeLocalDatabase().then(refresh).catch((cause: unknown) => setError(errorMessage(cause))) }, [])

  const campaign = workspace?.campaigns[0]
  const promo = campaign?.activePromoId ? workspace?.promos.find((item) => item.id === campaign.activePromoId) : undefined
  const customers = useMemo(() => (workspace?.customers ?? [])
    .filter((customer) => `${customer.fullName} ${customer.email}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
    .filter((customer) => {
      if (emailFilter === 'VALID') return ['VALID', 'SUSPECTED_TYPO', 'NEEDS_REVIEW'].includes(customer.emailStatus)
      if (emailFilter === 'INVALID') return customer.emailStatus === 'INVALID'
      if (emailFilter === 'EMPTY') return customer.emailStatus === 'UNKNOWN' || customer.emailStatus === 'DUMMY'
      return true
    }), [workspace, search, emailFilter])
  const dispatches = workspace?.dispatches ?? []

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true); setError(''); setNotice('')
    try { await action(); await refresh(); setNotice(success) } catch (cause) { setError(errorMessage(cause)) } finally { setBusy(false) }
  }
  async function handleFile(file?: File) {
    if (!file) return
    setError(''); setNotice('')
    if (file.size > 10 * 1024 * 1024) { setError('Ukuran file maksimal 10 MB.'); return }
    try {
      const buffer = await file.arrayBuffer()
      let text: string
      try { text = new TextDecoder('utf-8', { fatal: true }).decode(buffer) }
      catch { text = new TextDecoder('windows-1252').decode(buffer) }
      const parsed = file.name.toLocaleLowerCase().endsWith('.txt') ? parseSanghyangTextReport(text) : parseDelimitedFile(text)
      const inferred = inferColumnMapping(parsed.headers)
      const rows = flagPotentialDuplicateRows(normalizeImportRows(parsed, inferred))
      const hash = parsed.previewOnly ? '' : [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map((byte) => byte.toString(16).padStart(2, '0')).join('')
      setFileName(file.name); setFileHash(hash); setMapping(inferred); setImportRows(rows); setParsedFile(parsed)
    } catch (cause) { setError(errorMessage(cause)); setImportRows([]); setParsedFile(null) }
  }
  function remap(column: keyof Mapping, index: number) {
    const next = { ...mapping, [column]: index }
    setMapping(next)
    if (parsedFile) setImportRows(normalizeImportRows(parsedFile, next))
  }
  async function importSelected() {
    if (!fileName || !fileHash || parsedFile?.previewOnly) return
    await run(() => commitImport(fileName, fileHash, importRows), 'Impor lokal selesai. Kontak tersimpan di daftar browser ini.')
    setImportRows([]); setParsedFile(null); setFileName(''); setFileHash('')
  }
  function clearImportPreview() {
    setImportRows([]); setParsedFile(null); setFileName(''); setFileHash('')
    setMapping({ name: -1, birthDate: -1, email: -1 })
    setNotice('Pratinjau kontak sudah dihapus dari memori halaman ini.')
  }
  async function saveCampaignChanges() {
    if (!campaign) return
    await run(() => saveCampaign({ ...campaign, ...campaignForm }), 'Pengaturan kampanye tersimpan di browser ini.')
  }
  function editCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setEditValues({ fullName: customer.fullName, birthDate: customer.birthDate, email: customer.email })
    setEditError('')
  }
  async function saveCustomerChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingCustomer) return
    const birthDate = normalizeBirthDate(editValues.birthDate)
    if (!birthDate) { setEditError('Masukkan tanggal lahir yang valid dan tidak di masa depan.'); return }
    const name = normalizeName(editValues.fullName)
    const email = normalizeEmail(editValues.email)
    const updated: Customer = {
      ...editingCustomer,
      fullName: name.fullName,
      firstName: name.firstName,
      birthDate,
      email: editValues.email.trim(),
      emailNormalized: email.email,
      emailStatus: email.status,
    }
    setBusy(true); setEditError(''); setError(''); setNotice('')
    try {
      await saveCustomer(updated)
      await refresh()
      setEditingCustomer(null)
      setNotice('Perubahan kontak tersimpan di browser ini. Umur diperbarui dari tanggal lahir.')
    } catch (cause) { setEditError(errorMessage(cause)) }
    finally { setBusy(false) }
  }
  async function saveTemplateChanges() {
    if (!campaign) return
    await run(() => saveTemplateVersion(campaign, templateSubject, templateBody), 'Versi template baru tersimpan.')
  }
  async function savePromoChanges() {
    if (!campaign) return
    const next: Promo = { id: promo?.id ?? crypto.randomUUID(), campaignId: campaign.id, title: promoTitle.trim(), description: promoDescription.trim(), codePrefix: promoCodePrefix.trim(), validDaysAfterBirthday: 8, active: true, createdAt: promo?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() }
    await run(async () => { await savePromo(next); await saveCampaign({ ...campaign, activePromoId: next.id }) }, 'Promo tersimpan di browser ini.')
  }
  async function previewQueue() {
    if (!campaign || !workspace) return
    setBusy(true); setError(''); setNotice('')
    try {
      const result = await createPreviewDispatches(campaign, workspace.customers)
      await refresh()
      setNotice(`${result.created.length} pratinjau baru dibuat; ${result.alreadyQueuedCount} duplikat dicegah; ${result.excludedCount} kontak tidak masuk antrean. Tidak ada email yang dikirim.`)
    } catch (cause) { setError(errorMessage(cause)) }
    finally { setBusy(false) }
  }
  async function resetLocal() {
    if (!window.confirm('Hapus seluruh database lokal Birthday Automation dari browser ini? Tindakan ini tidak dapat dibatalkan.')) return
    await run(async () => { await clearLocalDatabase(); await initializeLocalDatabase() }, 'Database lokal direset ke data demo sintetis.')
  }

  if (!workspace) return <div className="loading-screen">Membuka workspace lokal…{error && <p role="alert">{error}</p>}</div>
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); setPage('Overview') }}><span className="brand-mark">S</span><span>Sanghyang<span className="brand-sub">Birthday Studio</span></span></a>
      <div className="nav-label">WORKSPACE</div>
      <nav aria-label="Navigasi utama">{nav.map((item, index) => <button key={item} className={`nav-item ${page === item ? 'active' : ''}`} onClick={() => setPage(item)}><span className="nav-icon">{['O', 'G', 'I', 'C', 'T', 'P', 'Q', 'R'][index]}</span>{item}</button>)}</nav>
      <div className="sidebar-bottom"><div className="avatar">SI</div><div><strong>Sanghyang Indah</strong><span>Workspace lokal</span></div></div>
    </aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> {page}</div><span className="local-badge"><i /> Lokal · tanpa cloud</span></header>
      <div className="content-wrap">
        <section className="page-heading"><div><h1>{page === 'Overview' ? 'Birthday campaigns' : page}</h1><p>Kelola alur email ulang tahun tamu.</p></div>{page === 'Overview' && <button className="primary-button" onClick={() => setPage('Campaign')}>+ Kampanye</button>}</section>
        <div className="preview-notice security-notice"><span>!</span><div><strong>Database browser lokal · tidak terenkripsi</strong><p>Gunakan data sintetis saja sampai penyimpanan aman disiapkan. Email uji terpisah tersedia di Monitoring setelah konfigurasi siap.</p></div><button aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}>×</button></div>
        {notice && <div className="inline-notice" role="status">{notice}</div>}{error && <div className="inline-error" role="alert">{error}</div>}
        {page === 'Overview' && <Overview workspace={workspace} campaign={campaign} onNavigate={setPage} />}
        {page === 'Customers' && <section className="section-block"><SectionTitle title="Daftar kontak" subtitle="Cari dan saring kontak. Umur selalu dihitung dari tanggal lahir; email valid dipakai apa adanya." /><div className="customer-controls"><Search value={search} onChange={setSearch} /><label className="customer-filter">Filter email<select value={emailFilter} onChange={(event) => setEmailFilter(event.target.value as typeof emailFilter)}><option value="ALL">Semua kontak</option><option value="VALID">Format valid</option><option value="INVALID">Format tidak valid</option><option value="EMPTY">Kosong atau dummy</option></select></label><span className="customer-count">{customers.length} dari {workspace.customers.length} kontak</span></div>{editingCustomer && <form className="customer-edit-panel" onSubmit={saveCustomerChanges}><div className="customer-edit-heading"><div><h3>Edit kontak</h3><p>Umur dihitung otomatis setelah tanggal lahir disimpan.</p></div><button type="button" className="text-button" onClick={() => { setEditingCustomer(null); setEditError('') }}>Batal</button></div><div className="customer-edit-fields"><label>Nama<input value={editValues.fullName} onChange={(event) => setEditValues({ ...editValues, fullName: event.target.value })} autoComplete="name" /></label><label>Tanggal lahir<input type="date" value={editValues.birthDate} onChange={(event) => setEditValues({ ...editValues, birthDate: event.target.value })} required /></label><label>Email<input value={editValues.email} onChange={(event) => setEditValues({ ...editValues, email: event.target.value })} autoComplete="email" /></label></div>{editError && <p className="inline-error" role="alert">{editError}</p>}<button type="submit" className="primary-button" disabled={busy}>Simpan kontak</button></form>}<CustomerTable customers={customers} campaign={campaign} onEdit={editCustomer}/></section>}
        {page === 'Import data' && <ImportPanel key={fileName || 'empty'} rows={importRows} headers={parsedFile?.headers ?? []} fileName={fileName} mapping={mapping} previewOnly={parsedFile?.previewOnly ?? false} busy={busy} onFile={handleFile} onMapping={remap} onToggle={(index) => setImportRows((items) => items.map((row, i) => i === index ? { ...row, selected: !row.selected } : row))} onImport={importSelected} onClear={clearImportPreview} />}
        {page === 'Campaign' && <section className="section-block editor-panel"><SectionTitle title="Pengaturan kampanye" subtitle="Waktu pengiriman mengikuti implementation plan." /><label>Nama kampanye<input value={campaignForm.name} onChange={(event) => setCampaignForm({ ...campaignForm, name: event.target.value })}/></label><label>Status<select value={campaignForm.status} onChange={(event) => setCampaignForm({ ...campaignForm, status: event.target.value as Campaign['status'] })}><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option></select></label><label>Hari sebelum ulang tahun<input type="number" min="1" max="30" value={Math.abs(campaignForm.sendOffsetDays)} onChange={(event) => setCampaignForm({ ...campaignForm, sendOffsetDays: -Math.min(30, Math.max(1, Number(event.target.value) || 7)) })}/></label><label>Jam kirim WIB<input type="time" value={campaignForm.sendTime} onChange={(event) => setCampaignForm({ ...campaignForm, sendTime: event.target.value })}/></label><div className="editor-summary">Default rencana: <strong>H-7 · 00:00 WIB · Asia/Jakarta</strong>. Jadwal kampanye aktif ditetapkan H-7.</div><button disabled={busy} className="primary-button" onClick={saveCampaignChanges}>Simpan kampanye</button></section>}
        {page === 'Email template' && <TemplatePanel subject={templateSubject} body={templateBody} sample={workspace.customers[0]} promoTitle={promo?.title || promoTitle || 'Hadiah ulang tahun'} promoDescription={promo?.description ?? promoDescription} busy={busy} onSubject={setTemplateSubject} onBody={setTemplateBody} onSave={saveTemplateChanges}/>}
        {page === 'Promo' && <section className="section-block editor-panel"><SectionTitle title="Promo ulang tahun" subtitle="Isi syarat dan nilai promo sesuai kebijakan bisnis yang telah disetujui." /><label>Nama promo<input value={promoTitle} onChange={(event) => setPromoTitle(event.target.value)} /></label><label>Deskripsi dan syarat<textarea rows={4} value={promoDescription} onChange={(event) => setPromoDescription(event.target.value)} /></label><label>Awalan kode promo<input value={promoCodePrefix} onChange={(event) => setPromoCodePrefix(event.target.value)} placeholder="Contoh: BDAY" /></label><div className="editor-summary">Masa berlaku mengikuti dokumen: H-1 sampai H+7. Tidak ada diskon atau nominal yang diasumsikan.</div><button disabled={busy || !promoTitle.trim()} className="primary-button" onClick={savePromoChanges}>Simpan promo</button></section>}
        {page === 'Send queue' && <section className="section-block"><SectionTitle title="Pratinjau antrean email" subtitle={`Jadwal simulasi H-${Math.abs(campaign?.sendOffsetDays ?? 7)} pukul ${campaign?.sendTime ?? '00:00'} WIB; tidak mengirim email.`}/><div className="dispatch-safety-note"><strong>Pencegahan duplikat aktif</strong><span>Satu catatan per kontak, kampanye, kanal email, dan tahun ulang tahun.</span></div><div className="local-monitor-grid"><article><span>Pratinjau tersimpan</span><strong>{dispatches.length}</strong><small>Semua belum dikirim</small></article><article><span>Email kampanye terkirim</span><strong>0</strong><small>Pengiriman produksi belum terhubung</small></article></div><button className="primary-button" disabled={busy || !campaign} onClick={previewQueue}>Buat pratinjau antrean</button><div className="queue-list">{[...dispatches].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).map((dispatch) => { const customer = workspace.customers.find((item) => item.id === dispatch.customerId); return <div className="queue-row" key={dispatch.id}><div><strong>{customer?.fullName ?? 'Pelanggan'}</strong><span>{customer?.email || 'Email tidak tersedia'} | ulang tahun {dispatch.birthdayYear}</span></div><span>{dispatch.scheduledAt.replace('T', ' | ').replace('+07:00', ' WIB')}</span><span className="contact-status review"><i/>Pratinjau lokal | belum dikirim</span></div> })}{!dispatches.length && <p className="empty-state">Belum ada pratinjau antrean.</p>}</div></section>}
        {page === 'Monitoring' && <section className="section-block editor-panel"><SectionTitle title="Monitoring pengiriman email" subtitle="Pratinjau antrean lokal dan email yang benar-benar dikirim ditampilkan terpisah."/><div className="local-monitor-grid"><article><span>Email kampanye terkirim</span><strong>0</strong><small>Belum ada pengiriman pelanggan</small></article><article><span>Pratinjau antrean</span><strong>{dispatches.length}</strong><small>Tidak dihitung sebagai email terkirim</small></article><article><span>Status provider</span><strong>Belum terhubung</strong><small>Webhook delivery belum tersedia</small></article></div><div className="editor-summary"><strong>Riwayat kampanye belum tersedia.</strong><br/>Antrean di bawah hanya simulasi lokal. Email uji dikirim terpisah ke TEST_RECIPIENT dan tidak mengubah status kontak.</div><TestEmailPanel subject={templateSubject} body={templateBody} promoTitle={promo?.title ?? 'Hadiah ulang tahun'} /><div className="queue-list">{[...dispatches].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)).map((dispatch) => { const customer = workspace.customers.find((item) => item.id === dispatch.customerId); return <div className="queue-row" key={dispatch.id}><div><strong>{customer?.fullName ?? 'Pelanggan'}</strong><span>{customer?.email || 'Email tidak tersedia'}</span></div><span>{dispatch.scheduledAt.replace('T', ' | ').replace('+07:00', ' WIB')}</span><span className="contact-status review"><i/>Pratinjau | tidak terkirim</span></div> })}{!dispatches.length && <p className="empty-state">Belum ada pratinjau atau hasil pengiriman.</p>}</div><button className="outline-button danger-button" onClick={resetLocal}>Hapus database demo lokal</button></section>}
        <footer className="footer"><span>Birthday Studio</span><span>H-7 · 00:00 WIB · Asia/Jakarta</span><span>Data hanya di browser ini</span></footer>
      </div>
    </main>
  </div>
}

function errorMessage(value: unknown) { return value instanceof Error ? value.message : 'Terjadi kesalahan yang tidak diketahui.' }
function emailQualityLabel(status: Customer['emailStatus']) {
  return ({ VALID: 'Format email valid', SUSPECTED_TYPO: 'Format email valid', NEEDS_REVIEW: 'Format email valid', INVALID: 'Format email tidak valid', DUMMY: 'Email dummy', UNKNOWN: 'Email kosong' })[status]
}
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) { return <div className="section-title"><div><h2>{title}</h2><p>{subtitle}</p></div></div> }
function Search({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <label className="search-box"><span>⌕</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Cari pelanggan" aria-label="Cari pelanggan" /></label> }

function Overview({ workspace, campaign, onNavigate }: { workspace: Workspace; campaign?: Campaign; onNavigate: (page: Page) => void }) {
  const eligible = workspace.customers.filter((item) => (item.emailStatus === 'VALID' || item.emailStatus === 'SUSPECTED_TYPO' || item.emailStatus === 'NEEDS_REVIEW') && !item.blacklisted && !item.duplicateGroupId).length
  return <>
    <section className="metric-row"><article className="metric"><span>Pelanggan lokal</span><strong>{workspace.customers.length}</strong><small><i className="dot sage"/>Termasuk data demo</small></article><article className="metric"><span>Layak pratinjau</span><strong>{eligible}</strong><small><i className="dot gold"/>Format email valid</small></article><article className="metric"><span>Antrean preview</span><strong>{workspace.dispatches.length}</strong><small><i className="dot gray"/>Tidak ada email terkirim</small></article><article className="date-card"><div className="calendar-icon">7</div><div><span>Waktu kampanye</span><strong>H-7 sebelum ulang tahun</strong><small>00:00 WIB · Asia/Jakarta</small></div></article></section>
    <section className="section-block"><SectionTitle title="Kampanye saat ini" subtitle="Konfigurasi email ulang tahun"/><article className="campaign-card"><div className="campaign-art"><div className="sun"/><div className="art-copy"><span>A LITTLE SOMETHING FOR YOU</span><strong>Celebrate<br/>beautifully.</strong><i>{campaign?.name}</i></div><div className="leaf leaf-one"/><div className="leaf leaf-two"/></div><div className="campaign-details"><div className="campaign-top"><div><span className="campaign-type">EMAIL CAMPAIGN</span><h3>{campaign?.name}</h3></div><span className="status draft">{campaign?.status}</span></div><p>Versi kampanye dan template disimpan di database browser lokal.</p><div className="campaign-meta"><div><span>Jadwal</span><strong>H-7 · 00:00 WIB</strong></div><div><span>Channel</span><strong>Email</strong></div><div><span>Kelayakan</span><strong>Email valid</strong></div></div><button className="outline-button" onClick={() => onNavigate('Campaign')}>Atur kampanye ↗</button></div></article></section>
    <section className="section-block quick-links"><button className="outline-button" onClick={() => onNavigate('Import data')}>Impor data</button><button className="outline-button" onClick={() => onNavigate('Email template')}>Edit template email</button><button className="outline-button" onClick={() => onNavigate('Send queue')}>Lihat antrean lokal</button><button className="outline-button" onClick={() => onNavigate('Monitoring')}>Monitoring email</button></section>
  </>
}

function CustomerTable({ customers, campaign, onEdit }: { customers: Customer[]; campaign?: Campaign; onEdit: (customer: Customer) => void }) {
  return <div className="table-wrap"><table className="customer-table"><thead><tr><th>Nama</th><th>Tanggal lahir</th><th>Umur</th><th>Email</th><th>Kualitas email</th><th>Jadwal berikutnya</th><th>Aksi</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td><div className="guest-cell"><div className="guest-avatar">{customer.firstName.slice(0, 1) || '·'}</div><div><strong>{customer.fullName || 'Tanpa nama'}</strong><span>{customer.source === 'DEMO' ? 'Demo sintetis' : customer.source === 'IMPORT' ? 'Impor lokal' : 'Manual'}</span></div></div></td><td>{customer.birthDate}</td><td>{calculateAge(customer.birthDate) ?? '—'}</td><td>{customer.email || '—'}</td><td>{emailQualityLabel(customer.emailStatus)}</td><td>{campaign ? scheduleDate(customer.birthDate, campaign.sendOffsetDays) : '—'} <small className="table-subline">00:00 WIB</small></td><td><button className="contact-edit-button" onClick={() => onEdit(customer)}>Edit</button></td></tr>)}</tbody></table>{customers.length === 0 && <p className="empty-state">Tidak ada kontak yang cocok.</p>}</div>
}

function ImportPanel({ rows, headers, fileName, mapping, previewOnly, busy, onFile, onMapping, onToggle, onImport, onClear }: { rows: ImportRow[]; headers: string[]; fileName: string; mapping: Mapping; previewOnly: boolean; busy: boolean; onFile: (file?: File) => void; onMapping: (column: keyof Mapping, index: number) => void; onToggle: (index: number) => void; onImport: () => void; onClear: () => void }) {
  const [page, setPage] = useState(0)
  const pageSize = 100
  const selected = rows.filter((row) => row.selected).length
  return <section className="section-block editor-panel import-panel">
    <SectionTitle title="Impor dan pembersihan data" subtitle="Kontak dengan email valid dapat masuk antrean ucapan. Umur dihitung dari tanggal lahir saat ini; hasil kirim dicatat terpisah di Monitoring." />
    <label className="file-picker">Pilih file<input type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values" onChange={(event) => onFile(event.target.files?.[0])} /></label>
    {fileName && <p className="file-name">File: {fileName} · batas 10 MB {previewOnly && '· pratinjau sementara'}</p>}
    {rows.length > 0 && <>
      <div className="mapping-grid">{(['name', 'birthDate', 'email'] as const).map((key) => <label key={key}>{key === 'birthDate' ? 'Tanggal lahir' : key === 'name' ? 'Nama' : 'Email'}<select value={mapping[key]} disabled={previewOnly} onChange={(event) => onMapping(key, Number(event.target.value))}><option value={-1}>— abaikan —</option>{headers.map((header, index) => <option key={index} value={index}>{header || `Kolom ${index + 1}`}</option>)}</select></label>)}</div>
      <div className="import-summary">
        <span><strong>{rows.length.toLocaleString('id-ID')}</strong> baris kontak</span>
        <span><strong>{rows.filter((row) => row.emailStatus === 'VALID').length.toLocaleString('id-ID')}</strong> format email valid</span>
        <span><strong>{rows.filter((row) => row.emailStatus === 'SUSPECTED_TYPO').length.toLocaleString('id-ID')}</strong> valid · kemungkinan typo</span>
        <span><strong>{rows.filter((row) => row.emailStatus === 'INVALID' || row.emailStatus === 'DUMMY' || row.emailStatus === 'UNKNOWN').length.toLocaleString('id-ID')}</strong> email tidak valid/kosong</span>
      </div>
      <div className="table-wrap"><table>
        <thead><tr>{!previewOnly && <th>Pilih</th>}<th>Baris</th><th>Nama</th><th>Tanggal lahir</th><th>Umur</th><th>Email</th><th>Kualitas email</th><th>Catatan data</th></tr></thead>
        <tbody>{rows.slice(page * pageSize, (page + 1) * pageSize).map((row, localIndex) => {
          const index = page * pageSize + localIndex
          return <tr key={row.recordNumber}>
            {!previewOnly && <td><input type="checkbox" checked={row.selected} disabled={row.status === 'ERROR'} onChange={() => onToggle(index)} /></td>}
            <td>{row.recordNumber}</td><td>{row.fullName || row.rawName}</td><td>{row.birthDate || row.rawBirthDate}</td><td>{calculateAge(row.birthDate) ?? '—'}</td>
            <td>{row.emailNormalized || '—'}{row.emailSuggestion && <small className="table-subline">Diperbaiki otomatis: {row.emailSuggestion.split("@")[1]}</small>}</td>
            <td>{emailQualityLabel(row.emailStatus)}</td><td>{row.reviewReason.map((reason) => <small className="table-subline" key={reason}>{reason}</small>)}</td>
          </tr>
        })}</tbody>
      </table></div>
      <div className="import-pagination"><span>Menampilkan {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} dari {rows.length.toLocaleString('id-ID')}</span><button className="outline-button" disabled={page === 0} onClick={() => setPage(page - 1)}>Sebelumnya</button><span>Halaman {page + 1} dari {Math.ceil(rows.length / pageSize)}</span><button className="outline-button" disabled={(page + 1) * pageSize >= rows.length} onClick={() => setPage(page + 1)}>Berikutnya</button></div>
      {previewOnly ? <p className="privacy-note"><strong>Pratinjau sementara saja.</strong> Laporan tidak disimpan ke IndexedDB; data kontak hilang saat pratinjau dihapus atau halaman dimuat ulang.</p> : <p className="privacy-note">Simpan hanya data sintetis di penyimpanan lokal browser yang belum terenkripsi.</p>}
      <div className="import-actions">{!previewOnly && <button className="primary-button" disabled={busy || !selected} onClick={onImport}>Impor {selected} baris terpilih</button>}<button className="outline-button" onClick={onClear}>Hapus pratinjau dari memori</button></div>
    </>}
  </section>
}

function TemplatePanel({ subject, body, sample, promoTitle, promoDescription, busy, onSubject, onBody, onSave }: { subject: string; body: string; sample?: Customer; promoTitle: string; promoDescription: string; busy: boolean; onSubject: (value: string) => void; onBody: (value: string) => void; onSave: () => void }) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [localImage, setLocalImage] = useState<{ name: string; url: string } | null>(null)
  const [imageError, setImageError] = useState('')
  useEffect(() => {
    return () => { if (localImage) URL.revokeObjectURL(localImage.url) }
  }, [localImage])
  const renderPreview = (value: string) => sample
    ? previewTemplate(value, sample, promoTitle)
    : value.replaceAll('{{first_name}}', 'Tamu').replaceAll('{{promo_name}}', promoTitle).replaceAll('{{booking_url}}', 'https://example.com/booking')
  const preview = renderPreview(body)
  const previewSubject = renderPreview(subject)
  function chooseImage(file?: File) {
    setImageError('')
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setImageError('Pilih gambar JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.')
      return
    }
    setLocalImage({ name: file.name, url: URL.createObjectURL(file) })
  }
  return <section className="section-block editor-panel"><SectionTitle title="Template email" subtitle="Setiap simpan membuat versi baru. Variabel tersedia: {{first_name}}, {{promo_name}}, {{booking_url}}."/><label>Subject<input value={subject} onChange={(event) => onSubject(event.target.value)}/></label><label>Isi email<textarea rows={9} value={body} onChange={(event) => onBody(event.target.value)}/></label>
    <div className="email-preview-controls"><div className="preview-size-toggle" role="group" aria-label="Ukuran pratinjau"><button type="button" aria-pressed={viewport === 'desktop'} onClick={() => setViewport('desktop')}>Desktop</button><button type="button" aria-pressed={viewport === 'mobile'} onClick={() => setViewport('mobile')}>Mobile</button></div><label className="file-picker">Pilih gambar lokal<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0])}/></label>{localImage && <><span className="file-name">{localImage.name}</span><button className="outline-button" type="button" onClick={() => { setLocalImage(null); setImageError('') }}>Gunakan kartu proyek</button></>}</div>
    <p className="privacy-note">Gambar pilihan hanya dipakai di pratinjau browser ini; tidak diunggah dan tidak disimpan.</p>{imageError && <p className="inline-error" role="alert">{imageError}</p>}
    <div className={`email-preview-stage ${viewport}`}><article className="birthday-email-preview"><div className="email-preview-label">PRATINJAU EMAIL · DATA CONTOH</div><p className="email-preview-subject">{previewSubject}</p><img src={localImage?.url || '/api/birthday-card'} alt="Kartu ucapan ulang tahun Sanghyang"/><div className="email-preview-body">{preview}</div><div className="email-preview-promo"><strong>{promoTitle || 'Promo ulang tahun'}</strong>{promoDescription && <p>{promoDescription}</p>}</div><button className="email-preview-cta" type="button">Sanghyang Indah Spa Resort</button><small>Tautan contoh · belum membuka halaman reservasi</small></article></div>
    <button className="primary-button" disabled={busy || !subject.trim() || !body.trim()} onClick={onSave}>Simpan sebagai versi baru</button></section>
}

type TestEmailConfig = { ready: boolean; missing: string[]; testRecipient: string; from: string }
function TestEmailPanel({ subject, body, promoTitle }: { subject: string; body: string; promoTitle: string }) {
  const [config, setConfig] = useState<TestEmailConfig | null>(null)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    fetch('/api/test-email').then(async (response) => {
      if (!response.ok) throw new Error('Server lokal belum aktif.')
      setConfig(await response.json() as TestEmailConfig)
    }).catch(() => setError('Endpoint uji email tidak aktif. Jalankan aplikasi dengan npm run dev.'))
  }, [])
  async function send() {
    setSending(true); setError(''); setResult('')
    try {
      const response = await fetch('/api/test-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, body, promoTitle }) })
      const payload = await response.json() as { sent?: boolean; messageId?: string | null; recipient?: string; error?: string; missing?: string[] }
      if (!response.ok) throw new Error(payload.missing?.length ? `Konfigurasi belum lengkap: ${payload.missing.join(', ')}` : payload.error ?? 'Email uji gagal dikirim.')
      setResult(`Server SMTP menerima email uji untuk ${payload.recipient}. ID pesan: ${payload.messageId ?? 'tidak diberikan'}. Periksa Inbox penerima untuk memastikan email tiba.`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Email uji gagal dikirim.') }
    finally { setSending(false) }
  }
  return <div className="test-email-panel"><h3>Kirim satu email uji</h3><p>Konten memakai nama contoh dan kartu ucapan proyek. Penerima tidak dapat diubah dari aplikasi.</p>{config && <div className="editor-summary">Penerima terkunci: <strong>{config.testRecipient || 'belum diatur'}</strong><br/>Pengirim: {config.from || 'belum diatur'}<br/>{config.ready ? 'Konfigurasi lokal siap.' : `Belum siap: ${config.missing.join(', ')}`}</div>}<button className="primary-button" disabled={sending || !config?.ready || !subject.trim() || !body.trim()} onClick={send}>{sending ? 'Mengirim...' : 'Kirim email uji ke penerima pribadi'}</button>{result && <p className="inline-notice" role="status">{result}</p>}{error && <p className="inline-error" role="alert">{error}</p>}</div>
}

export default App
