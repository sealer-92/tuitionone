'use client'

import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

interface Props {
  itemId: string
  title: string
  durationSeconds: number | null
}

export function VideoPlayer({ itemId, title, durationSeconds }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadVideo() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/content/${itemId}/url`)
      if (!res.ok) throw new Error('Could not load video')
      const data = await res.json()
      setUrl(data.url)
    } catch {
      setError('Failed to load video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const mins = durationSeconds ? Math.floor(durationSeconds / 60) : null

  if (url) {
    return (
      <div style={{ borderRadius: 14, overflow: 'hidden', background: '#000', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', padding: '12px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)' }}>
          {title}
        </div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video controls style={{ width: '100%', display: 'block', maxHeight: 480 }} src={url} />
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--paper)' }}>
      <button onClick={loadVideo} disabled={loading} style={{
        width: 48, height: 48, borderRadius: '50%',
        background: loading ? 'var(--cream)' : 'var(--orange)',
        color: 'white', border: 0, cursor: loading ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Play size={20} fill="white" />
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        {mins && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{mins} min</div>}
        {error && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
      </div>
    </div>
  )
}
