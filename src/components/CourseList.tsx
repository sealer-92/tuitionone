'use client'

import { useState } from 'react'
import { Course } from '@/lib/courses'
import { CourseCard } from './CourseCard'

const YEARS    = ['All', '5th Year', '6th Year', 'Junior Cert']
const SUBJECTS = ['All', 'Maths', 'Chemistry', 'Science']

interface CourseListProps {
  courses: Course[]
  dark?: boolean
}

export function CourseList({ courses, dark }: CourseListProps) {
  const [yearFilter,    setYearFilter]    = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All')

  const filtered = courses.filter((c) =>
    (yearFilter    === 'All' || c.year    === yearFilter) &&
    (subjectFilter === 'All' || c.subject === subjectFilter)
  )

  function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
      <button onClick={onClick} style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: 600,
        padding: '8px 16px',
        borderRadius: 999,
        border: active ? '1.5px solid var(--orange)' : dark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid var(--border-strong)',
        background: active ? (dark ? 'rgba(229,143,63,0.18)' : 'rgba(229,143,63,0.12)') : 'transparent',
        color: active ? (dark ? 'var(--orange-soft)' : 'var(--orange-deep)') : (dark ? 'var(--chalk)' : 'var(--ink)'),
        cursor: 'pointer',
        transition: 'all 120ms ease',
      }}>{label}</button>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: dark ? 'rgba(245,239,228,0.55)' : 'var(--fg-3)', minWidth: 60 }}>Year</span>
          {YEARS.map((y) => <Chip key={y} active={yearFilter === y} onClick={() => setYearFilter(y)} label={y} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: dark ? 'rgba(245,239,228,0.55)' : 'var(--fg-3)', minWidth: 60 }}>Subject</span>
          {SUBJECTS.map((s) => <Chip key={s} active={subjectFilter === s} onClick={() => setSubjectFilter(s)} label={s} />)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {filtered.map((c) => <CourseCard key={c.id} course={c} dark={dark} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', fontFamily: 'var(--font-body)', color: dark ? 'rgba(245,239,228,0.6)' : 'var(--fg-2)' }}>
          No courses match that filter. Try widening your search.
        </div>
      )}
    </div>
  )
}
