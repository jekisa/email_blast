/**
 * Script sekali pakai untuk membuat akun admin pertama.
 * Jalankan: node scripts/create-admin.mjs
 */
import { randomUUID } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import pg from 'pg'
import { hashPassword } from 'better-auth/crypto'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '../..')
dotenv.config({ path: resolve(projectRoot, '.env') })

const DATABASE_URL = process.env.DATABASE_URL
const ADMIN_EMAIL  = (process.env.ADMIN_INITIAL_EMAIL ?? '').replace(/^"|"$/g, '')

if (!DATABASE_URL) throw new Error('DATABASE_URL belum diisi di .env')
if (!ADMIN_EMAIL)  throw new Error('ADMIN_INITIAL_EMAIL belum diisi di .env')

// Password sementara — ubah setelah login pertama
const TEMP_PASSWORD = 'Admin@Automation2024!'

const pool = new pg.Pool({ connectionString: DATABASE_URL })
const client = await pool.connect()

try {
  await client.query('BEGIN')

  // Cek apakah user admin sudah ada
  const { rows: existing } = await client.query(
    'SELECT id FROM "user" WHERE username = $1',
    ['admin']
  )
  if (existing.length > 0) {
    console.log('⚠️  User admin sudah ada. Gunakan reset-admin-password.mjs untuk mengubah password.')
    await client.query('ROLLBACK')
    process.exit(0)
  }

  // Buat user admin
  const userId = randomUUID()
  const now = new Date()
  await client.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", role, banned, username, "displayUsername", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, true, 'admin', false, 'admin', 'Admin', $4, $4)`,
    [userId, 'Admin', ADMIN_EMAIL, now]
  )

  // Buat credential account dengan password ter-hash
  const hashedPassword = await hashPassword(TEMP_PASSWORD)
  await client.query(
    `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
     VALUES ($1, $2, 'credential', $3, $4, $5, $5)`,
    [randomUUID(), userId, userId, hashedPassword, now]
  )

  await client.query('COMMIT')
  console.log('✅ Akun admin berhasil dibuat!')
  console.log(`   Username : admin`)
  console.log(`   Email    : ${ADMIN_EMAIL}`)
  console.log(`   Password : ${TEMP_PASSWORD}`)
  console.log('')
  console.log('⚠️  Segera ubah password setelah login pertama.')
} catch (err) {
  await client.query('ROLLBACK')
  throw err
} finally {
  client.release()
  await pool.end()
}

