'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from './Button'

export function AuthSignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const res = await signIn('resend', {
      email: email.trim().toLowerCase(),
      callbackUrl: callbackUrl ?? '/dashboard',
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('No account found for that email. Have you purchased a course?')
    } else {
      window.location.href = '/auth/verify'
    }
  }

  const fieldStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    padding: '13px 16px',
    background: 'white',
    border: '1px solid var(--border-strong)',
    borderRadius: 10,
    color: 'var(--ink)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', boxShadow: 'var(--shadow-md)' }}>
        <label>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.02em', display: 'block', marginBottom: 8 }}>
            Email address
          </span>
          <input
            type="email"
            required
            placeholder="aoife@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={fieldStyle}
            autoComplete="email"
            autoFocus
          />
        </label>

        {error && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--danger)', marginTop: 10, marginBottom: 0 }}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
        >
          {loading ? 'Sending link…' : 'Send sign-in link'}
        </Button>
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center', margin: 0 }}>
        Don&apos;t have an account?{' '}
        <a href="/courses" style={{ color: 'var(--orange-deep)', fontWeight: 600 }}>Purchase a course first</a>.
      </p>
    </form>
  )
}
