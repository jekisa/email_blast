'use client'

import { useState, type FormEvent } from 'react'
import { authClient } from './lib/auth-client'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    if (window.location.port === '5173') {
      setMessage('Login admin berjalan melalui aplikasi Next.js pada port 3000.')
      return
    }
    const result = await authClient.signIn.username({ username, password, callbackURL: '/dashboard' })
    if (result.error) setMessage('Username atau password tidak cocok.')
    else window.location.assign('/dashboard')
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-name">Sanghyang</span>
          <span className="login-brand-caption">BIRTHDAY AUTOMATION</span>
        </div>
        <h1 id="login-title">Selamat datang</h1>
        <p className="login-intro">Masuk ke ruang admin Anda</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Username admin</label>
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(event) => { setUsername(event.target.value); setMessage('') }}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setMessage('') }}
            required
          />

          <button type="submit">Masuk</button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>

        <p className="login-admin-note">Akses khusus administrator · registrasi publik dimatikan</p>
      </section>
    </main>
  )
}
