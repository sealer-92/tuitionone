'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookletData { id: string; order: number; title: string }

const field: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 11px', background: 'white',
  border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)',
}
const btn: React.CSSProperties = {
  background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600,
  fontSize: 13, padding: '9px 18px', borderRadius: 8, border: 0, cursor: 'pointer',
}

export function AdminBookletManager({ courseId, booklets }: { courseId: string; booklets: BookletData[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function upload() {
    if (!file || !title) { setError('Title and file are required'); return }
    setError('')
    try {
      setBusy('Requesting upload URL…')
      const urlRes = await fetch('/api/admin/upload-url', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, type: 'BOOKLET', fileName: file.name, contentType: file.type || 'application/pdf' }),
      })
      const { uploadUrl, r2Key, error: e1 } = await urlRes.json()
      if (!urlRes.ok) throw new Error(e1 ?? 'Failed to get upload URL')

      setBusy('Uploading to R2…')
      const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/pdf' }, body: file })
      if (!put.ok) throw new Error(`R2 upload failed (${put.status})`)

      setBusy('Saving…')
      const save = await fetch(`/api/admin/courses/${courseId}/booklets`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, r2Key }),
      })
      const { error: e2 } = await save.json()
      if (!save.ok) throw new Error(e2 ?? 'Failed to save booklet')

      setTitle(''); setFile(null); setBusy(''); router.refresh()
    } catch (err) {
      setBusy(''); setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  async function deleteBooklet(id: string, bookletTitle: string) {
    if (!confirm(`Delete "${bookletTitle}"? This also removes the file from storage.`)) return
    const res = await fetch(`/api/admin/booklets/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {booklets.length === 0 && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)' }}>No booklets yet.</span>}
        {booklets.map((b) => (
          <span key={b.id} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            📄 {b.title}
            <button onClick={() => deleteBooklet(b.id, b.title)} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)', background: 'none', border: 0, cursor: 'pointer' }} aria-label={`Delete ${b.title}`}>
              ×
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
        <input style={{ ...field, flex: 1, minWidth: 140 }} placeholder="Booklet title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }} />
        <button style={btn} onClick={upload} disabled={!!busy}>{busy || 'Upload booklet'}</button>
        {error && <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 13, width: '100%' }}>{error}</span>}
      </div>
    </div>
  )
}
