'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CourseFormat } from '@prisma/client'

const field: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 15, padding: '10px 12px', background: 'white',
  border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--ink)', width: '100%', boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 6, display: 'block',
}

type EurosField = number | ''

export interface CourseFormValues {
  id?: string
  title: string
  slug: string
  subject: string
  year: string
  schedule: string
  weeks: number
  status: string
  description: string
  format: CourseFormat
  fullPriceEuros: EurosField
  fullPhysicalPriceEuros: EurosField
  digitalBookletPriceEuros: EurosField
  physicalBookletPriceEuros: EurosField
}

export function CourseForm({ initial }: { initial?: Partial<CourseFormValues> }) {
  const router = useRouter()
  const editing = Boolean(initial?.id)

  const [form, setForm] = useState<CourseFormValues>({
    id: initial?.id,
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    subject: initial?.subject ?? '',
    year: initial?.year ?? '',
    schedule: initial?.schedule ?? '',
    weeks: initial?.weeks ?? 14,
    status: initial?.status ?? 'DRAFT',
    description: initial?.description ?? '',
    format: initial?.format ?? 'VIDEO_AND_BOOKLET',
    fullPriceEuros: initial?.fullPriceEuros ?? '',
    fullPhysicalPriceEuros: initial?.fullPhysicalPriceEuros ?? '',
    digitalBookletPriceEuros: initial?.digitalBookletPriceEuros ?? '',
    physicalBookletPriceEuros: initial?.physicalBookletPriceEuros ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const upd = <K extends keyof CourseFormValues>(k: K, v: CourseFormValues[K]) => setForm((f) => ({ ...f, [k]: v }))
  const isVideo = form.format === 'VIDEO_AND_BOOKLET'

  async function submit() {
    setSaving(true); setError('')
    try {
      const res = await fetch(editing ? `/api/admin/courses/${form.id}` : '/api/admin/courses', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to save course'); return }
      if (editing) router.refresh()
      else router.push(`/admin/courses/${json.id}`)
    } finally { setSaving(false) }
  }

  function priceInput(key: keyof CourseFormValues, text: string) {
    return (
      <label><span style={label}>{text} (€)</span>
        <input type="number" min={0} style={field} value={form[key] as EurosField}
          onChange={(e) => upd(key, (e.target.value === '' ? '' : Number(e.target.value)) as CourseFormValues[typeof key])} />
      </label>
    )
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <label style={{ gridColumn: '1 / -1' }}><span style={label}>Title</span><input style={field} value={form.title} onChange={(e) => upd('title', e.target.value)} /></label>
        <label><span style={label}>Slug (unique)</span><input style={field} value={form.slug} onChange={(e) => upd('slug', e.target.value)} placeholder="e.g. hl-maths" /></label>
        <label><span style={label}>Subject</span><input style={field} value={form.subject} onChange={(e) => upd('subject', e.target.value)} /></label>
        <label><span style={label}>Year</span><input style={field} value={form.year} onChange={(e) => upd('year', e.target.value)} placeholder="e.g. 5th & 6th Year" /></label>
        <label><span style={label}>Schedule</span><input style={field} value={form.schedule} onChange={(e) => upd('schedule', e.target.value)} placeholder="Saturday 09:00–10:00" /></label>
        <label><span style={label}>Weeks</span><input type="number" style={field} value={form.weeks} onChange={(e) => upd('weeks', Number(e.target.value))} /></label>
        <label><span style={label}>Status</span>
          <select style={field} value={form.status} onChange={(e) => upd('status', e.target.value)}>
            <option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label><span style={label}>Format</span>
          <select style={field} value={form.format} onChange={(e) => upd('format', e.target.value as CourseFormat)}>
            <option value="VIDEO_AND_BOOKLET">Videos &amp; booklets</option>
            <option value="BOOKLET_ONLY">Booklets only</option>
          </select>
        </label>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '24px 0 12px' }}>Pricing</h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)', margin: '0 0 16px' }}>
        Leave a price blank to hide that option. {isVideo ? 'Full options include the videos.' : 'Booklet-only courses sell digital and printed booklets.'}
      </p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        {isVideo && priceInput('fullPriceEuros', 'Videos + digital booklet')}
        {isVideo && priceInput('fullPhysicalPriceEuros', 'Videos + digital + printed')}
        {priceInput('digitalBookletPriceEuros', 'Digital booklet only')}
        {priceInput('physicalBookletPriceEuros', 'Printed booklet only')}
      </div>

      <label style={{ display: 'block', marginTop: 16 }}><span style={label}>Description</span><textarea style={{ ...field, minHeight: 80 }} value={form.description} onChange={(e) => upd('description', e.target.value)} /></label>

      {error && <p style={{ color: 'var(--danger)', fontFamily: 'var(--font-body)', fontSize: 14, marginTop: 12 }}>{error}</p>}
      <button onClick={submit} disabled={saving} style={{ marginTop: 20, background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 10, border: 0, cursor: 'pointer' }}>
        {saving ? 'Saving…' : editing ? 'Save changes' : 'Create course'}
      </button>
    </div>
  )
}
