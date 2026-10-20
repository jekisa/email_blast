'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignOutButton } from './sign-out'

const pages = [
  { href: '/dashboard', label: 'Dashboard', icon: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /> },
  { href: '/dashboard/campaigns', label: 'Campaign', icon: <><path d="m4 11 15-6v14L4 13z" /><path d="m7 14 2 6h4l-2-7M19 9a4 4 0 0 1 0 8" /></> },
  { href: '/dashboard/contacts', label: 'Kontak', icon: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1zM17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" /></> },
  { href: '/dashboard/monitoring', label: 'Monitoring', icon: <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 6-7" /></> },
]

export default function DashboardFrame({ children, userName }: Readonly<{ children: React.ReactNode; userName: string }>) {
  const pathname = usePathname()
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/dashboard" aria-label="Sanghyang Birthday Automation — Dashboard"><Image src="/sanghyang-resort-logo.png" alt="Sanghyang Indah Spa Resort" width={188} height={141} priority /></a>
      <nav aria-label="Navigasi admin">{pages.map((page) => {
        const active = page.href === '/dashboard' ? pathname === page.href : pathname.startsWith(page.href)
        return <a key={page.href} href={page.href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}><svg viewBox="0 0 24 24" aria-hidden="true">{page.icon}</svg><span>{page.label}</span></a>
      })}</nav>
      <div className="sidebar-profile"><span className="profile-avatar">{userName.slice(0, 1).toUpperCase()}</span><span><strong>{userName}</strong><small>Akses administrator</small></span></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><div><span>Ruang admin</span><strong>{pages.find((page) => page.href === pathname)?.label ?? pages.find((page) => pathname.startsWith(page.href) && page.href !== '/dashboard')?.label ?? 'Overview'}</strong></div><div className="topbar-account"><span className="topbar-user">{userName}</span><SignOutButton /></div></header>
      {children}
    </div>
  </div>
}
