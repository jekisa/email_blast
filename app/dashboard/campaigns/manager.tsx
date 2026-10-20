'use client'

import { useCallback, useEffect, useState } from 'react'

const defaultSubject = 'Selamat ulang tahun, {{first_name}}!'
const defaultBody = 'Halo {{first_name}},\n\nSelamat ulang tahun! Semoga hari istimewa ini penuh kebahagiaan, kesehatan, dan momen indah.\n\nTerima kasih telah menjadi bagian dari Sanghyang. Kami berharap dapat menyambut Anda kembali.\n\nSalam hangat,\nTim Sanghyang'

type Template = { id: string; version: number; name: string | null; subject: string; bodyHtml: string; isActive: boolean }
type Campaign = {
  id: string; name: string; status: string; sendOffsetDays: number; sendTime: string; whatsappPhone: string | null;
  templates: Template[];
  assets: { publicUrl: string; altText: string }[];
}
const parse = async (response: Response) => { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error ?? `Server gagal memuat data (${response.status}). Coba lagi atau hubungi admin teknis.`); return data }
const plainText = (html: string) => html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const statusLabel = (status: string) => status === 'active' ? 'Aktif' : status === 'paused' ? 'Pause' : status === 'ended' ? 'Selesai' : 'Draft'
const scheduleLabel = (offset: number) => offset === 0 ? 'H-0 · hari ulang tahun' : `H-${Math.abs(offset)} · ${Math.abs(offset)} hari sebelumnya`
const versionLabel = (template: Template) => `${template.name?.trim() || 'Tanpa nama'} · Versi ${template.version}${template.isActive ? ' · aktif' : ''}`
const json = (method: string, body: unknown) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [section, setSection] = useState<'create' | 'start'>('start')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const refresh = useCallback(async () => { const data = await parse(await fetch('/api/admin/campaigns', { cache: 'no-store' })); setCampaigns(data.campaigns) }, [])
  useEffect(() => { refresh().catch((error) => setMessage(error.message)) }, [refresh])
  const drafts = campaigns.filter((campaign) => campaign.status === 'draft')
  const running = campaigns.filter((campaign) => campaign.status !== 'draft')
  const activeNames = (exceptId: string) => campaigns.filter((campaign) => campaign.status === 'active' && campaign.id !== exceptId).map((campaign) => campaign.name)

  async function createCampaign(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await parse(await fetch('/api/admin/campaigns', json('POST', { name })))
      await refresh(); setShowCreate(false); setName('')
      setMessage('Draft dibuat dengan contoh ucapan dan kartu. Lengkapi lalu aktifkan dari kartunya.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Campaign gagal dibuat.') } finally { setBusy(false) }
  }

  return <main className="manage-page"><header><h1>Campaign ulang tahun</h1><p>Siapkan ucapan sebagai draft, lalu aktifkan. Campaign aktif mengirim email otomatis pukul 00.00 WIB.</p></header>
    {message && <p className="manage-message" role="status">{message}</p>}
    <nav className="campaign-nav" role="tablist" aria-label="Bagian campaign">
      <button id="campaign-tab-create" type="button" role="tab" aria-selected={section === 'create'} aria-controls="campaign-panel-create" onClick={() => setSection('create')}>Buat Campaign ({drafts.length} draft)</button>
      <button id="campaign-tab-start" type="button" role="tab" aria-selected={section === 'start'} aria-controls="campaign-panel-start" onClick={() => setSection('start')}>Mulai Campaign ({running.length} berjalan)</button>
    </nav>
    {section === 'create' && <section id="campaign-panel-create" role="tabpanel" aria-labelledby="campaign-tab-create" className="campaign-section">
      <div className="campaign-section-heading"><div><span className="eyebrow">DRAFT</span><h2>Buat Campaign</h2></div><button type="button" onClick={() => setShowCreate((open) => !open)} aria-expanded={showCreate}>{showCreate ? 'Batal' : '+ Buat campaign baru'}</button></div>
      {showCreate && <form className="manage-card create-form" onSubmit={createCampaign}><label>Nama campaign<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} placeholder="Contoh: Ucapan Ulang Tahun 2027" required autoFocus /></label><button disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan draft'}</button></form>}
      {drafts.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} open={false} activeNames={activeNames(campaign.id)} onRefresh={refresh} onMessage={setMessage} />)}
      {!drafts.length && !showCreate && <section className="manage-card"><strong>Belum ada draft.</strong><p>Klik “+ Buat campaign baru” untuk menyiapkan ucapan baru.</p></section>}
    </section>}
    {section === 'start' && <section id="campaign-panel-start" role="tabpanel" aria-labelledby="campaign-tab-start" className="campaign-section">
      <div className="campaign-section-heading"><div><span className="eyebrow">BERJALAN</span><h2>Mulai Campaign</h2></div><p>Campaign aktif dan yang dijeda. Ubah status, jadwal, atau isi ucapan di sini.</p></div>
      {running.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} open activeNames={activeNames(campaign.id)} onRefresh={refresh} onMessage={setMessage} />)}
      {!running.length && <section className="manage-card"><strong>Belum ada campaign yang berjalan.</strong><p>Buka tab Buat Campaign, lalu ubah status draft menjadi Aktif.</p></section>}
    </section>}
  </main>
}

function CampaignCard({ campaign, open, activeNames, onRefresh, onMessage }: { campaign: Campaign; open: boolean; activeNames: string[]; onRefresh: () => Promise<void>; onMessage: (value: string) => void }) {
  const active = campaign.templates[0]
  const [status, setStatus] = useState(campaign.status)
  const [offset, setOffset] = useState(campaign.sendOffsetDays)
  const [whatsappPhone, setWhatsappPhone] = useState(campaign.whatsappPhone ?? '+628119011600')
  const [history, setHistory] = useState<Template[]>([])
  const [selectedVersion, setSelectedVersion] = useState(active?.version ?? 0)
  const [versionName, setVersionName] = useState(active?.name ?? '')
  const [subject, setSubject] = useState(active?.subject?.trim() ? active.subject : defaultSubject)
  const [body, setBody] = useState(active?.bodyHtml?.trim() ? plainText(active.bodyHtml) : defaultBody)
  const [assetUrl, setAssetUrl] = useState(campaign.assets[0]?.publicUrl ?? '/kartu-ucapan-ulang-tahun.jpeg')
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  useEffect(() => { setStatus(campaign.status); setOffset(campaign.sendOffsetDays) }, [campaign.status, campaign.sendOffsetDays])
  useEffect(() => { setWhatsappPhone(campaign.whatsappPhone ?? '+628119011600') }, [campaign.whatsappPhone])
  const loadHistory = useCallback(async () => { const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates`, { cache: 'no-store' })); setHistory(data.templates); return data.templates as Template[] }, [campaign.id])
  useEffect(() => { loadHistory().catch((error) => onMessage(error.message)) }, [loadHistory, onMessage])
  const selected = history.find((item) => item.version === selectedVersion)

  async function run(action: () => Promise<unknown>, success: string) {
    setSaving(true); onMessage('')
    try { await action(); await onRefresh(); onMessage(success) }
    catch (error) { onMessage(error instanceof Error ? error.message : 'Perubahan gagal disimpan.') }
    finally { setSaving(false) }
  }
  function selectVersion(version: number) {
    setSelectedVersion(version)
    const template = history.find((item) => item.version === version)
    if (template) { setSubject(template.subject); setBody(plainText(template.bodyHtml)); setVersionName(template.name ?? '') }
  }

  function saveSchedule() {
    const activating = status === 'active' && status !== campaign.status
    const replacing = activating && activeNames.length > 0
    if (activating && !window.confirm(replacing
      ? `${activeNames.join(', ')} sedang aktif. Kalau ${campaign.name} diaktifkan, ${activeNames.join(', ')} otomatis dijeda. Lanjutkan?`
      : `Aktifkan ${campaign.name}? Email akan dikirim otomatis ke customer yang berulang tahun.`)) return
    return saveScheduleChanges(replacing)
  }
  const saveScheduleChanges = (replacing: boolean) => run(async () => {
    const changes: Record<string, unknown> = {}
    if (status !== campaign.status) changes.status = status
    if (replacing) changes.replaceActive = true
    if (offset !== campaign.sendOffsetDays) changes.sendOffsetDays = offset
    await parse(await fetch(`/api/admin/campaigns/${campaign.id}`, json('PATCH', changes)))
    if (changes.status === 'active') await parse(await fetch('/api/admin/dispatches/preview', json('POST', { campaignId: campaign.id })))
  }, status === 'paused' && status !== campaign.status ? 'Campaign dijeda. Email yang belum dikirim ditahan.' : replacing ? `${campaign.name} aktif. ${activeNames.join(', ')} dijeda.` : 'Status dan jadwal tersimpan.')
  const saveWhatsAppPhone = () => run(async () => { const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}`, json('PATCH', { whatsappPhone }))); setWhatsappPhone(data.campaign.whatsappPhone ?? '') }, 'Nomor WhatsApp tersimpan.')
  const saveNewVersion = () => run(async () => {
    const result = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates`, json('POST', { subject, body, name: versionName })))
    await loadHistory(); setSelectedVersion(result.template.version)
  }, 'Versi baru tersimpan dan langsung dipakai.')
  const renameVersion = () => run(async () => { await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, json('PATCH', { name: versionName }))); await loadHistory() }, 'Nama versi tersimpan.')
  const useVersion = () => run(async () => { await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, json('PATCH', { isActive: true }))); await loadHistory() }, `Versi ${selectedVersion} sekarang dipakai untuk email.`)
  async function deleteVersion() {
    if (!selectedVersion || !window.confirm(`Hapus versi ${selectedVersion}?`)) return
    await run(async () => {
      await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, { method: 'DELETE' }))
      const templates = await loadHistory()
      const current = templates.find((item) => item.isActive)
      setSelectedVersion(current?.version ?? 0); setVersionName(current?.name ?? '')
      setSubject(current?.subject ?? defaultSubject); setBody(current ? plainText(current.bodyHtml) : defaultBody)
    }, 'Versi dihapus.')
  }
  async function upload(file?: File) {
    if (!file) return
    const form = new FormData(); form.set('file', file); form.set('campaignId', campaign.id); form.set('altText', 'Kartu ucapan ulang tahun Sanghyang')
    await run(async () => { const result = await parse(await fetch('/api/admin/assets', { method: 'POST', body: form })); setAssetUrl(result.asset.publicUrl) }, 'Kartu ucapan tersimpan.')
  }
  const preview = () => run(async () => { const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/preview`, json('POST', { subject, body }))); setPreviewHtml(data.html) }, 'Pratinjau diperbarui. Email tidak dikirim.')
  async function sendTest() {
    setTesting(true); onMessage('')
    try {
      const data = await parse(await fetch('/api/admin/email/test', { method: 'POST' }))
      onMessage(`Email tes diterima server SMTP untuk ${data.recipient}. Periksa inbox dan folder spam.`)
    } catch (error) { onMessage(error instanceof Error ? error.message : 'Email tes gagal dikirim.') }
    finally { setTesting(false) }
  }

  return <details className="manage-card campaign-card" open={open}>
    <summary><span className="campaign-card-title"><strong>{campaign.name}</strong><small>{scheduleLabel(campaign.sendOffsetDays)} · pukul 00.00 WIB</small></span><span className={`campaign-state ${campaign.status}`}>{statusLabel(campaign.status)}</span></summary>

    <h3>Status dan jadwal</h3>
    <div className="campaign-start-controls">
      <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="draft">Draft</option><option value="active">Aktif</option><option value="paused">Pause</option></select></label>
      <label>Kirim<select value={offset} onChange={(event) => setOffset(Number(event.target.value))}>{Array.from({ length: 8 }, (_, days) => <option key={days} value={-days}>{scheduleLabel(-days)}</option>)}</select></label>
      <button onClick={saveSchedule} disabled={saving || (status === campaign.status && offset === campaign.sendOffsetDays)}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
    </div>
    <p className="manage-hint">Email selalu dikirim mulai pukul 00.00 WIB. Default H-0, tepat di hari ulang tahun.</p>

    <h3>WhatsApp</h3>
    <label>Nomor WhatsApp<input type="tel" value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} maxLength={16} placeholder="+628119011600" /></label>
    <p className="manage-hint">Tombol “Claim Your Birthday Treats” di email langsung membuka chat ke nomor ini. Format internasional, contoh +628119011600.</p>
    <button onClick={saveWhatsAppPhone} disabled={saving || whatsappPhone === (campaign.whatsappPhone ?? '')}>Simpan nomor</button>

    <h3>Ucapan</h3>
    <div className="campaign-version-row">
      <label>Versi tersimpan<select value={selectedVersion} onChange={(e) => selectVersion(Number(e.target.value))}>{!history.length && <option value={0}>Belum ada versi</option>}{history.map((item) => <option key={item.id} value={item.version}>{versionLabel(item)}</option>)}</select></label>
      <button className="outline-button" onClick={useVersion} disabled={saving || !selected || selected.isActive}>Pakai versi ini</button>
      <button className="outline-button" onClick={deleteVersion} disabled={saving || !selectedVersion}>Hapus versi</button>
    </div>
    <p className="manage-hint">Memilih versi hanya memuat teksnya ke editor. Klik “Pakai versi ini” agar email memakai versi tersebut.</p>
    <label>Nama versi<input value={versionName} onChange={(e) => setVersionName(e.target.value)} maxLength={60} placeholder="Contoh: Ucapan Oktober" /></label>
    <label>Subjek<input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={180} /></label>
    <label>Isi ucapan<textarea rows={7} value={body} onChange={(e) => setBody(e.target.value)} maxLength={6000} /></label>
    <p className="manage-hint">{'{{first_name}}'} otomatis diganti nama depan penerima.</p>
    <div className="editor-footer"><button onClick={saveNewVersion} disabled={saving}>Simpan sebagai versi baru</button><button className="outline-button" onClick={renameVersion} disabled={saving || !selected || (selected.name ?? '') === versionName.trim()}>Simpan nama versi</button></div>

    <h3>Kartu ulang tahun</h3>
    <label className="upload-label">Ganti foto (JPEG, PNG, atau WebP, maks. 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files?.[0]).catch((error) => onMessage(error.message))} /></label>
    {assetUrl && <img className="asset-thumb" src={assetUrl} alt="Pratinjau kartu ulang tahun" />}

    <div className="editor-footer"><button onClick={preview} disabled={saving || testing}>Pratinjau email</button><button className="outline-button" onClick={sendTest} disabled={saving || testing}>{testing ? 'Mengirim email tes...' : 'Kirim email tes'}</button><span>Hanya ke alamat penerima tes yang dikonfigurasi di server.</span></div>
    {previewHtml && <section className="email-preview"><div className="editor-footer"><strong>Pratinjau email</strong><button className="outline-button" onClick={() => setPreviewMode('desktop')} aria-pressed={previewMode === 'desktop'}>Desktop</button><button className="outline-button" onClick={() => setPreviewMode('mobile')} aria-pressed={previewMode === 'mobile'}>Mobile</button></div><iframe title="Pratinjau email ulang tahun" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={previewHtml} style={{ display: 'block', width: previewMode === 'mobile' ? '390px' : '100%', maxWidth: '100%', height: '620px', margin: '12px auto', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }} /></section>}
  </details>
}
