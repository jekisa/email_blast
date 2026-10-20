import { birthdaySchedule, type Campaign, type Customer, type Dispatch, type ImportBatch, type ImportRow, type Promo, type TemplateVersion } from './domain'

const DB_NAME = 'birthday-automation-local-v1'
const DB_VERSION = 1
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      const customers = db.createObjectStore('customers', { keyPath: 'id' })
      customers.createIndex('by-email', 'emailNormalized')
      customers.createIndex('by-birth-date', 'birthDate')
      db.createObjectStore('campaigns', { keyPath: 'id' })
      db.createObjectStore('promos', { keyPath: 'id' })
      const templates = db.createObjectStore('templates', { keyPath: 'id' })
      templates.createIndex('by-campaign-version', ['campaignId', 'version'], { unique: true })
      const dispatches = db.createObjectStore('dispatches', { keyPath: 'id' })
      dispatches.createIndex('unique-dispatch', ['customerId', 'campaignId', 'channel', 'birthdayYear'], { unique: true })
      const batches = db.createObjectStore('importBatches', { keyPath: 'id' })
      batches.createIndex('by-file-hash', 'fileHash', { unique: true })
      db.createObjectStore('stagingRows', { keyPath: 'id' }).createIndex('by-batch', 'batchId')
      db.createObjectStore('auditLogs', { keyPath: 'id' }).createIndex('by-created', 'createdAt')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Database lokal tidak dapat dibuka.'))
  })
}

function transact<T>(stores: string[], mode: IDBTransactionMode, action: (tx: IDBTransaction) => IDBRequest<T>): Promise<T> {
  return openDatabase().then((db) => new Promise<T>((resolve, reject) => {
    const tx = db.transaction(stores, mode)
    const request = action(tx)
    let result: T
    request.onsuccess = () => { result = request.result }
    request.onerror = () => reject(request.error ?? new Error('Operasi database lokal gagal.'))
    tx.oncomplete = () => { db.close(); resolve(result) }
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error('Transaksi database lokal gagal.')) }
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Transaksi database lokal dibatalkan.')) }
  }))
}

function readAll<T>(store: string): Promise<T[]> {
  return transact([store], 'readonly', (tx) => tx.objectStore(store).getAll())
}
function putOne<T>(store: string, value: T): Promise<IDBValidKey> {
  return transact([store], 'readwrite', (tx) => tx.objectStore(store).put(value))
}
function id() { return crypto.randomUUID() }
function timestamp() { return new Date().toISOString() }

function addAudit(tx: IDBTransaction, action: string, entityType: string, entityId: string, details: Record<string, unknown> = {}) {
  tx.objectStore('auditLogs').add({ id: id(), action, entityType, entityId, details, createdAt: timestamp() })
}

function localBirthday(daysFromToday: number) {
  const date = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const today = Object.fromEntries(parts.map(({ type, value }) => [type, value])) as Record<string, string>
  const target = new Date(Date.UTC(Number(today.year), Number(today.month) - 1, Number(today.day) + daysFromToday))
  return `2000-${String(target.getUTCMonth() + 1).padStart(2, '0')}-${String(target.getUTCDate()).padStart(2, '0')}`
}

export async function initializeLocalDatabase() {
  const [campaigns, customers] = await Promise.all([readAll<Campaign>('campaigns'), readAll<Customer>('customers')])
  if (!campaigns.length) {
    const campaignId = 'campaign-birthday-default'
    const templateId = 'template-birthday-v1'
    const now = timestamp()
    const campaign: Campaign = { id: campaignId, name: 'Birthday Escape', status: 'DRAFT', sendOffsetDays: -7, sendTime: '00:00', timezone: 'Asia/Jakarta', activeTemplateId: templateId, activePromoId: null, createdAt: now, updatedAt: now }
    const template: TemplateVersion = { id: templateId, campaignId, version: 1, subject: 'A birthday gift for {{first_name}}', body: 'Hello {{first_name}},\n\nYour birthday is coming up in seven days. We would love to celebrate with you.\n\n{{promo_name}}\n\nPlan your visit: {{booking_url}}', createdAt: now }
    await Promise.all([putOne('campaigns', campaign), putOne('templates', template)])
  }
  if (!customers.length) {
    const demo = [
      { name: 'Nadia Putri', email: 'nadia@example.com', offset: 7 },
      { name: 'Rafi Wijaya', email: 'rafi@example.com', offset: 8 },
      { name: 'Maya Santoso', email: 'maya@example.com', offset: 9 },
    ]
    const now = timestamp()
    await Promise.all(demo.map((item) => putOne<Customer>('customers', {
      id: id(), fullName: item.name, firstName: item.name.split(' ')[0], birthDate: localBirthday(item.offset),
      email: item.email, emailNormalized: item.email, emailStatus: 'VALID',
      blacklisted: false, duplicateGroupId: null, dataQualityScore: 100, reviewReason: [], importBatchId: null,
      createdAt: now, updatedAt: now, source: 'DEMO',
    })))
  }
}

export async function loadWorkspace() {
  const [customers, campaigns, promos, templates, dispatches, batches] = await Promise.all([
    readAll<Customer>('customers'), readAll<Campaign>('campaigns'), readAll<Promo>('promos'),
    readAll<TemplateVersion>('templates'), readAll<Dispatch>('dispatches'), readAll<ImportBatch>('importBatches'),
  ])
  return { customers, campaigns, promos, templates, dispatches, batches }
}

export function saveCampaign(campaign: Campaign) {
  return putOne('campaigns', { ...campaign, updatedAt: timestamp() })
}
export function savePromo(promo: Promo) {
  return putOne('promos', { ...promo, updatedAt: timestamp() })
}

export async function saveCustomer(customer: Customer) {
  const db = await openDatabase()
  const tx = db.transaction(['customers', 'auditLogs'], 'readwrite')
  const updated = { ...customer, updatedAt: timestamp() }
  tx.objectStore('customers').put(updated)
  addAudit(tx, 'customer.updated', 'customer', customer.id, { source: customer.source })
  try {
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Kontak gagal disimpan.'))
      tx.onabort = () => reject(tx.error ?? new Error('Perubahan kontak dibatalkan.'))
    })
  } finally { db.close() }
  return updated
}

export async function saveTemplateVersion(campaign: Campaign, subject: string, body: string) {
  const db = await openDatabase()
  const tx = db.transaction(['campaigns', 'templates', 'auditLogs'], 'readwrite')
  const version = await new Promise<number>((resolve, reject) => {
    const request = tx.objectStore('templates').index('by-campaign-version').getAll(IDBKeyRange.bound([campaign.id, 0], [campaign.id, Number.MAX_SAFE_INTEGER]))
    request.onsuccess = () => resolve(request.result.length + 1)
    request.onerror = () => reject(request.error)
  })
  const newTemplate: TemplateVersion = { id: id(), campaignId: campaign.id, version, subject, body, createdAt: timestamp() }
  const updated = { ...campaign, activeTemplateId: newTemplate.id, updatedAt: timestamp() }
  tx.objectStore('templates').add(newTemplate)
  tx.objectStore('campaigns').put(updated)
  addAudit(tx, 'template.version.created', 'campaign', campaign.id, { version })
  await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) })
  db.close()
  return { campaign: updated, template: newTemplate }
}

export async function commitImport(fileName: string, fileHash: string, rows: ImportRow[]) {
  const existingBatches = await readAll<ImportBatch>('importBatches')
  if (existingBatches.some((batch) => batch.fileHash === fileHash)) throw new Error('File ini sudah pernah diimpor ke database lokal.')
  const selected = rows.filter((row) => row.selected && row.status !== 'ERROR')
  const batchId = id()
  const now = timestamp()
  const batch: ImportBatch = { id: batchId, fileName, fileHash, importedAt: now, importedCount: selected.length, reviewCount: selected.filter((row) => row.reviewReason.length > 0).length, errorCount: rows.filter((row) => row.status === 'ERROR').length }
  const current = await readAll<Customer>('customers')
  const byNameBirth = new Map<string, Customer[]>()
  const byEmailBirth = new Map<string, Customer[]>()
  const changedExistingIds = new Set<string>()
  const nameBirthKey = (name: string, birthDate: string) => `${name.trim().toLocaleLowerCase()}|${birthDate}`
  const emailBirthKey = (email: string, birthDate: string) => `${email.trim().toLocaleLowerCase()}|${birthDate}`
  const indexCustomer = (customer: Customer) => {
    if (customer.source === 'DEMO') return
    const nameKey = nameBirthKey(customer.fullName, customer.birthDate)
    const nameMatches = byNameBirth.get(nameKey)
    if (nameMatches) nameMatches.push(customer)
    else byNameBirth.set(nameKey, [customer])
    if (customer.emailNormalized) {
      const emailKey = emailBirthKey(customer.emailNormalized, customer.birthDate)
      const emailMatches = byEmailBirth.get(emailKey)
      if (emailMatches) emailMatches.push(customer)
      else byEmailBirth.set(emailKey, [customer])
    }
  }
  current.forEach(indexCustomer)
  const toAdd: Customer[] = []
  for (const row of selected) {
    const nameMatches = byNameBirth.get(nameBirthKey(row.fullName, row.birthDate)) ?? []
    const emailMatches = row.emailNormalized ? byEmailBirth.get(emailBirthKey(row.emailNormalized, row.birthDate)) ?? [] : []
    const matches = [...new Map([...nameMatches, ...emailMatches].map((customer) => [customer.id, customer])).values()]
    const nowForRow = timestamp()
    const groupId = matches.length ? matches.find((customer) => customer.duplicateGroupId)?.duplicateGroupId ?? `dup-${id()}` : null
    const reasons = [...row.reviewReason]
    if (matches.length) {
      reasons.push('Kemungkinan duplikat; perlu review manual')
      matches.forEach((customer) => {
        customer.duplicateGroupId = groupId
        customer.reviewReason = [...new Set([...customer.reviewReason, 'Kemungkinan duplikat; perlu review manual'])]
        customer.updatedAt = nowForRow
        changedExistingIds.add(customer.id)
      })
    }
    const customer: Customer = {
      id: id(), fullName: row.fullName, firstName: row.firstName, birthDate: row.birthDate,
      email: row.rawEmail.trim(), emailNormalized: row.emailNormalized, emailStatus: row.emailStatus,
      blacklisted: false, duplicateGroupId: groupId, dataQualityScore: row.dataQualityScore,
      reviewReason: reasons, importBatchId: batchId, createdAt: nowForRow, updatedAt: nowForRow, source: 'IMPORT',
    }
    toAdd.push(customer)
    indexCustomer(customer)
  }
  const db = await openDatabase()
  const tx = db.transaction(['importBatches', 'stagingRows', 'customers', 'auditLogs'], 'readwrite')
  tx.objectStore('importBatches').add(batch)
  selected.forEach((row) => tx.objectStore('stagingRows').add({ id: id(), batchId, recordNumber: row.recordNumber, status: row.status, reviewReason: row.reviewReason, createdAt: now }))
  toAdd.forEach((customer) => tx.objectStore('customers').add(customer))
  current.filter((customer) => changedExistingIds.has(customer.id)).forEach((customer) => tx.objectStore('customers').put(customer))
  addAudit(tx, 'import.batch.committed', 'import_batch', batchId, { importedCount: batch.importedCount, reviewCount: batch.reviewCount, errorCount: batch.errorCount })
  await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) })
  db.close()
  return batch
}

export async function createPreviewDispatches(campaign: Campaign, customers: Customer[]) {
  const campaignId = campaign.id
  const db = await openDatabase()
  const tx = db.transaction(['dispatches', 'auditLogs'], 'readwrite')
  const index = tx.objectStore('dispatches').index('unique-dispatch')
  const created: Dispatch[] = []
  let alreadyQueuedCount = 0
  let excludedCount = 0
  for (const customer of customers) {
    if ((customer.emailStatus !== 'VALID' && customer.emailStatus !== 'SUSPECTED_TYPO' && customer.emailStatus !== 'NEEDS_REVIEW') || customer.blacklisted || customer.duplicateGroupId) { excludedCount += 1; continue }
    const schedule = birthdaySchedule(customer.birthDate, campaign.sendOffsetDays)
    if (!schedule) { excludedCount += 1; continue }
    const key = [customer.id, campaignId, 'EMAIL', schedule.birthdayYear]
    const exists = await new Promise<boolean>((resolve, reject) => {
      const request = index.get(IDBKeyRange.only(key))
      request.onsuccess = () => resolve(Boolean(request.result))
      request.onerror = () => reject(request.error)
    })
    if (exists) { alreadyQueuedCount += 1; continue }
    const dispatch: Dispatch = { id: id(), customerId: customer.id, campaignId, channel: 'EMAIL', birthdayYear: schedule.birthdayYear, scheduledAt: `${schedule.date}T${campaign.sendTime}:00+07:00`, status: 'PREVIEW_QUEUED', createdAt: timestamp() }
    tx.objectStore('dispatches').add(dispatch)
    created.push(dispatch)
  }
  addAudit(tx, 'dispatch.preview.created', 'campaign', campaignId, { createdCount: created.length, alreadyQueuedCount, excludedCount })
  await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) })
  db.close()
  return { created, alreadyQueuedCount, excludedCount }
}

export function clearLocalDatabase() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Database lokal gagal dihapus.'))
    request.onblocked = () => reject(new Error('Database sedang digunakan tab lain. Tutup tab aplikasi lain, lalu coba lagi.'))
  })
}
