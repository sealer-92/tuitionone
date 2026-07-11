'use client'

import { useState } from 'react'
import { Button } from './Button'

const field: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 15, padding: '12px 14px', background: 'white',
  border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)', width: '100%', boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 6, display: 'block',
}

export function RaiseIssueForm() {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setSending(true); setError('')
    try {
      const res = await fetch('/api/support', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not send your issue. Please try again.'); return }
      setDone(true); setSubject(''); setMessage('')
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally { setSending(false) }
  }

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Need help?</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', margin: '4px 0 0' }}>Raise an issue and our team will look into it.</p>
        </div>
        {!open && <Button variant="secondary" size="sm" onClick={() => { setOpen(true); setDone(false) }}>Raise an issue</Button>}
      </div>

      {open && !done && (
        <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
          <label><span style={label}>Subject</span><input style={field} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" /></label>
          <label><span style={label}>Message</span><textarea style={{ ...field, minHeight: 110, resize: 'vertical' }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the problem…" /></label>
          {error && <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#B5483C' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={sending}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={sending || !subject.trim() || !message.trim()}>{sending ? 'Sending…' : 'Send issue'}</Button>
          </div>
        </div>
      )}

      {done && (
        <div style={{ marginTop: 16, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--leaf-deep)' }}>
          Thanks — your issue has been sent. We&apos;ll be in touch by email.
        </div>
      )}
    </div>
  )
}
