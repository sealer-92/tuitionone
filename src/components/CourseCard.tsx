'use client'

import { useState } from 'react'
import { Course } from '@/lib/courses'
import { optionsForCourse } from '@/lib/options'
import { Button } from './Button'

interface CourseCardProps {
  course: Course
  dark?: boolean
}

export function CourseCard({ course, dark }: CourseCardProps) {
  const [hover, setHover] = useState(false)

  const surface: React.CSSProperties = dark
    ? { background: 'var(--chalkboard-deep)', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--chalk)' }
    : { background: 'var(--paper)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', color: 'var(--ink)' }

  const eyebrowColor = dark ? 'var(--orange)' : 'var(--orange-deep)'
  const metaColor    = dark ? 'rgba(245,239,228,0.7)' : 'rgba(27,42,36,0.7)'
  const subMetaColor = dark ? 'rgba(245,239,228,0.55)' : 'rgba(27,42,36,0.55)'
  const priceColor   = dark ? 'var(--orange)' : 'var(--ink)'

  const options = optionsForCourse(course)
  const fromPrice = options.length ? Math.min(...options.map((o) => o.priceCents)) / 100 : null
  const formatLabel = course.format === 'VIDEO_AND_BOOKLET' ? 'Videos & booklets' : 'Booklets only'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...surface,
        borderRadius: 16,
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 120ms var(--ease)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: eyebrowColor }}>
        {course.subject} · {formatLabel}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: dark ? 'var(--chalk)' : 'var(--ink)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        {course.title}
      </h3>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: metaColor }}>
        {course.year} · {course.schedule}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: subMetaColor, letterSpacing: '0.04em' }}>from</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 28, color: priceColor }}>{fromPrice != null ? `€${fromPrice}` : '—'}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="primary" size="sm" href={`/enrol?course=${course.id}`}>Reserve a place</Button>
      </div>
    </div>
  )
}
