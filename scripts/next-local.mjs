import { existsSync, readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '../..')
dotenv.config({ path: resolve(projectRoot, '.env') })

const caPath = resolve(projectRoot, 'prod-ca-2021.crt')
if (!process.env.SUPABASE_CA_CERT && existsSync(caPath)) {
  process.env.SUPABASE_CA_CERT = readFileSync(caPath, 'utf8')
}

const nextBin = resolve(scriptDir, '../node_modules/next/dist/bin/next')
const next = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  env: process.env,
  stdio: 'inherit',
})

next.on('error', (error) => {
  console.error('Gagal menjalankan server Next.js:', error.message)
  process.exitCode = 1
})
next.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
