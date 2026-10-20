import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '../../src/lib/auth'
import DashboardFrame from './dashboard-frame'

export default async function ProtectedDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'admin') redirect('/login')
  return <DashboardFrame userName={session.user.name || 'Admin'}>{children}</DashboardFrame>
}
