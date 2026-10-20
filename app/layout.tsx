import type { Metadata } from 'next'
import '../src/index.css'
import '../src/login.css'
import './dashboard.css'
import './management.css'

export const metadata: Metadata = {
  title: 'Birthday Automation | Sanghyang',
  description: 'Admin email ucapan ulang tahun Sanghyang.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>
}
