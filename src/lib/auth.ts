import 'server-only'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, username } from 'better-auth/plugins'
import { prisma } from './prisma'

const authSecret = process.env.BETTER_AUTH_SECRET
if (!authSecret || authSecret.length < 32) throw new Error('BETTER_AUTH_SECRET harus berisi sedikitnya 32 karakter.')

export const auth = betterAuth({
  appName: 'Birthday Automation',
  baseURL: process.env.BETTER_AUTH_URL,
  secret: authSecret,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
  plugins: [username({ minUsernameLength: 3, maxUsernameLength: 32 }), admin({ adminRoles: ['admin'], defaultRole: 'user' })],
  advanced: { cookiePrefix: 'birthday-automation' },
})
