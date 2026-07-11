'use client'

import { useState } from 'react'
import { FileText, Download, ExternalLink } from 'lucide-react'

interface Props {
  itemId: string
  title: string
}

export function NotesPdfViewer({ itemId, title }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function openNotes(mode: 'view' | 'download') {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/content/${itemId}/url`)
      if (!res.ok) throw new Error('Could not load notes')
      const { url } = await res.json()
      if (mode === 'download') {
        const a = document.createElement('a')
        a.href = url
        a.download = `${title}.pdf`
        a.click()
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--paper)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(229,143,63,0.12)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FileText size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        {error && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => openNotes('view')} disabled={loading} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
          <ExternalLink size={13} />View
        </button>
        <button onClick={() => openNotes('download')} disabled={loading} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
          <Download size={13} />Download
        </button>
      </div>
    </div>
  )
}
