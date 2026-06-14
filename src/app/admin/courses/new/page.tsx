'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const field: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 15, padding: '10px 12px', background: 'white',
  border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)', width: '100%', boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 6, display: 'block',
}

export default function NewCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', slug: '', subject: '', year: '', schedule: '',
    weeks: 14, priceEuros: 450, status: 'DRAFT', description: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const upd = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  async function submit() {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to create course'); return }
      router.push(`/admin/courses/${json.id}`)
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 24px' }}>New course</h1>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <label style={{ gridColumn: '1 / -1' }}><span style={label}>Title</span><input style={field} value={form.title} onChange={(e) => upd('title', e.target.value)} /></label>
        <label><span style={label}>Slug (unique)</span><input style={field} value={form.slug} onChange={(e) => upd('slug', e.target.value)} placeholder="e.g. hm-5-2026" /></label>
        <label><span style={label}>Subject</span><input style={field} value={form.subject} onChange={(e) => upd('subject', e.target.value)} /></label>
        <label><span style={label}>Year</span><input style={field} value={form.year} onChange={(e) => upd('year', e.target.value)} placeholder="e.g. 5th Year" /></label>
        <label><span style={label}>Schedule</span><input style={field} value={form.schedule} onChange={(e) => upd('schedule', e.target.value)} placeholder="Saturday 09:00–10:00" /></label>
        <label><span style={label}>Weeks</span><input type="number" style={field} value={form.weeks} onChange={(e) => upd('weeks', Number(e.target.value))} /></label>
        <label><span style={label}>Price (€)</span><input type="number" style={field} value={form.priceEuros} onChange={(e) => upd('priceEuros', Number(e.target.value))} /></label>
        <label><span style={label}>Status</span>
          <select style={field} value={form.status} onChange={(e) => upd('status', e.target.value)}>
            <option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}><span style={label}>Description</span><textarea style={{ ...field, minHeight: 80 }} value={form.description} onChange={(e) => upd('description', e.target.value)} /></label>
      </div>
      {error && <p style={{ color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 14, marginTop: 12 }}>{error}</p>}
      <button onClick={submit} disabled={saving} style={{ marginTop: 20, background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 10, border: 0, cursor: 'pointer' }}>
        {saving ? 'Creating…' : 'Create course'}
      </button>
    </div>
  )
}
