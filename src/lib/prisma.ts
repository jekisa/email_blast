import 'server-only'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL belum dikonfigurasi.')

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pool?: Pool }
const caCertificate = process.env.SUPABASE_CA_CERT
const databaseUrl = new URL(connectionString)
if (process.env.NODE_ENV === 'production' && databaseUrl.hostname.endsWith('.pooler.supabase.com') && databaseUrl.port === '5432') {
  databaseUrl.port = '6543'
}
const pool = globalForPrisma.pool ?? (caCertificate
  ? (() => {
      const url = databaseUrl
      for (const key of ['ssl', 'sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']) {
        url.searchParams.delete(key)
      }
      return new Pool({ connectionString: url.toString(), max: 1, ssl: { ca: caCertificate } })
    })()
  : new Pool({ connectionString: databaseUrl.toString(), max: 1 }))

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}
