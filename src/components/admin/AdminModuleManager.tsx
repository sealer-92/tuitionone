'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContentItem { id: string; type: string; title: string; durationSeconds: number | null }
interface ModuleData { id: string; order: number; title: string; contentItems: ContentItem[] }

const field: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 11px', background: 'white',
  border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)',
}
const btn: React.CSSProperties = {
  background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600,
  fontSize: 13, padding: '9px 18px', borderRadius: 8, border: 0, cursor: 'pointer',
}

function UploadContent({ moduleId }: { moduleId: string }) {
  const router = useRouter()
  const [type, setType] = useState('NOTES')
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
        body: JSON.stringify({ moduleId, type, fileName: file.name, contentType: file.type || 'application/octet-stream' }),
      })
      const { uploadUrl, r2Key, error: e1 } = await urlRes.json()
      if (!urlRes.ok) throw new Error(e1 ?? 'Failed to get upload URL')

      setBusy('Uploading to R2…')
      const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file })
      if (!put.ok) throw new Error(`R2 upload failed (${put.status})`)

      setBusy('Saving…')
      const save = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, type, title, r2Key }),
      })
      const { error: e2 } = await save.json()
      if (!save.ok) throw new Error(e2 ?? 'Failed to save content')

      setTitle(''); setFile(null); setBusy(''); router.refresh()
    } catch (err) {
      setBusy(''); setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
      <select style={field} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="NOTES">Notes (PDF)</option>
        <option value="VIDEO">Video</option>
      </select>
      <input style={{ ...field, flex: 1, minWidth: 140 }} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="file" accept={type === 'VIDEO' ? 'video/*' : 'application/pdf'} onChange={(e) => setFile(e.target.files?.[0] ?? null)} style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }} />
      <button style={btn} onClick={upload} disabled={!!busy}>{busy || 'Upload'}</button>
      {error && <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 13, width: '100%' }}>{error}</span>}
    </div>
  )
}

export function AdminModuleManager({ courseId, modules }: { courseId: string; modules: ModuleData[] }) {
  const router = useRouter()
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  async function addModule() {
    if (!newTitle) return
    setAdding(true)
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }),
      })
      if (res.ok) { setNewTitle(''); router.refresh() }
    } finally { setAdding(false) }
  }

  async function deleteContent(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This also removes the file from storage.`)) return
    const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  async function deleteModule(id: string, title: string) {
    if (!confirm(`Delete module "${title}" and all its content (including files)?`)) return
    const res = await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {modules.map((m) => (
          <div key={m.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                {m.order}. {m.title}
              </div>
              <button onClick={() => deleteModule(m.id, m.title)} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--danger)', background: 'none', border: 0, cursor: 'pointer' }}>
                Delete module
              </button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {m.contentItems.length === 0 && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-3)' }}>No content yet.</span>}
              {m.contentItems.map((c) => (
                <span key={c.id} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {c.type === 'VIDEO' ? '🎬' : '📄'} {c.title}
                  <button onClick={() => deleteContent(c.id, c.title)} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)', background: 'none', border: 0, cursor: 'pointer' }} aria-label={`Delete ${c.title}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <UploadContent moduleId={m.id} />
          </div>
        ))}
        {modules.length === 0 && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)' }}>No modules yet.</span>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <input style={{ ...field, flex: 1 }} placeholder="New module title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button style={btn} onClick={addModule} disabled={adding}>{adding ? 'Adding…' : '+ Add module'}</button>
      </div>
    </div>
  )
}
