import { useState } from 'react'
import { supabase } from './lib/supabase'
import { button, card, input, muted } from './ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={submit}
        style={{ ...card, width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={{ fontSize: 22, fontWeight: 800 }}>AGIC Admin</div>
        <div style={{ ...muted, marginBottom: 4 }}>Sign in to manage the site</div>
        <input
          type="email"
          required
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
        />
        {error && <div style={{ fontSize: 13, color: 'oklch(50% 0.18 30)' }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ ...button, opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
