'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Problem = { id: string; name: string; email: string; date: string; reason: string; canResend: boolean }

export default function ProblemList({ problems }: { problems: Problem[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState('')
  const [message, setMessage] = useState('')
  async function act(problem: Problem, action: 'resend' | 'reviewed') {
    const question = action === 'resend'
      ? `Kirim ulang sekali ke ${problem.email}? Jika email pertama ternyata sampai, customer menerima 2 email.`
      : `Tandai ${problem.email} sudah diperiksa tanpa kirim ulang?`
    if (!window.confirm(question)) return
    setBusyId(problem.id); setMessage('')
    try {
      const response = await fetch(`/api/admin/dispatches/${problem.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Aksi gagal.')
      setMessage(action === 'resend' ? `${problem.name} masuk antrean dan dikirim pada putaran cron berikutnya.` : `${problem.name} ditandai sudah diperiksa.`)
      router.refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Aksi gagal.') } finally { setBusyId('') }
  }
  return <>
    {message && <p className="manage-message" role="status">{message}</p>}
    {problems.length ? <div className="table-scroll"><table><thead><tr><th>Kontak</th><th>Tanggal kirim</th><th>Alasan</th><th>Aksi</th></tr></thead><tbody>{problems.map((problem) => <tr key={problem.id}>
      <td>{problem.name}<small className="table-detail">{problem.email}</small></td>
      <td>{problem.date}</td>
      <td>{problem.reason}</td>
      <td><div className="problem-actions"><button disabled={!!busyId || !problem.canResend} title={problem.canResend ? undefined : 'Sudah pernah dicoba ulang atau sudah diterima SMTP'} onClick={() => act(problem, 'resend')}>Kirim ulang 1x</button><button className="outline-button" disabled={!!busyId} onClick={() => act(problem, 'reviewed')}>Tandai sudah diperiksa</button></div></td>
    </tr>)}</tbody></table></div> : <p>Semua pengiriman aman. Tidak ada yang perlu diperiksa.</p>}
  </>
}
