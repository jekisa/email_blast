'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '../../src/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  return <button className="sign-out" onClick={async () => { await authClient.signOut(); router.replace('/login') }}>Keluar</button>
}
