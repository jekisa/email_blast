import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { stdin, stdout } from 'node:process'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { hashPassword } from 'better-auth/crypto'

const projectRef = 'mudruljnsexahvapkmep'
const databaseUrl = new URL(process.env.DATABASE_URL ?? '')
const supabaseUrl = new URL(process.env.SUPABASE_URL ?? '')
if (supabaseUrl.hostname !== `${projectRef}.supabase.co` || !decodeURIComponent(databaseUrl.username).includes(projectRef)) {
  throw new Error('Konfigurasi tidak menunjuk ke database Birthday Automation.')
}

function readSecret(label) {
  if (!stdin.isTTY || !stdin.setRawMode) throw new Error('Jalankan perintah ini dari terminal interaktif.')
  return new Promise((resolveSecret, reject) => {
    let value = ''
    stdout.write(label)
    stdin.setRawMode(true)
    stdin.setEncoding('utf8')
    stdin.resume()
    const finish = (error) => {
      stdin.off('data', onData)
      stdin.setRawMode(false)
      stdin.pause()
      stdout.write('\n')
      error ? reject(error) : resolveSecret(value)
    }
    const onData = (key) => {
      for (const character of key) {
        if (character === '\u0003') {
          finish(new Error('Dibatalkan.'))
          return
        }
        if (character === '\r' || character === '\n') {
          finish()
          return
        }
        if (character === '\u007f' || character === '\b') {
          if (value.length) {
            value = value.slice(0, -1)
            stdout.write('\b \b')
          }
        } else if (character >= ' ') {
          value += character
          stdout.write('*')
        }
      }
    }
    stdin.on('data', onData)
  })
}

const password = await readSecret('Password baru (min. 5 karakter): ')
const confirmation = await readSecret('Ulangi password baru: ')
if (password.length < 5 || password.length > 128) throw new Error('Password harus 5–128 karakter.')
if (password !== confirmation) throw new Error('Kedua password tidak sama.')

for (const key of ['ssl', 'sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']) {
  databaseUrl.searchParams.delete(key)
}
const certificatePath = resolve(dirname(fileURLToPath(import.meta.url)), '../../prod-ca-2021.crt')
const pool = new pg.Pool({ connectionString: databaseUrl.toString(), ssl: { ca: readFileSync(certificatePath, 'utf8') } })
const client = await pool.connect()
try {
  await client.query('BEGIN')
  const { rows: users } = await client.query('SELECT id FROM "user" WHERE username = $1 FOR UPDATE', ['admin'])
  if (!users[0]) throw new Error('User admin tidak ditemukan di database Birthday Automation.')
  const userId = users[0].id
  const hashedPassword = await hashPassword(password)
  const { rows: accounts } = await client.query(
    'SELECT id FROM account WHERE "userId" = $1 AND "providerId" = $2 FOR UPDATE',
    [userId, 'credential'],
  )
  if (accounts[0]) {
    await client.query('UPDATE account SET password = $1, "updatedAt" = now() WHERE id = $2', [hashedPassword, accounts[0].id])
  } else {
    await client.query(
      'INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, now(), now())',
      [randomUUID(), userId, 'credential', userId, hashedPassword],
    )
  }
  await client.query('DELETE FROM session WHERE "userId" = $1', [userId])
  await client.query('COMMIT')
  stdout.write('Password admin Birthday Automation berhasil diubah. Silakan login dengan admin dan password baru.\n')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
  await pool.end()
}
