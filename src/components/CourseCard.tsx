'use client'

import { Course } from '@/lib/courses'
import { optionsForCourse } from '@/lib/options'
import { Button } from './Button'

interface CourseCardProps {
  course: Course
  dark?: boolean
}

export function CourseCard({ course, dark }: CourseCardProps) {
  const surface: React.CSSProperties = dark
    ? { background: 'var(--chalkboard-deep)', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--chalk)' }
    : { background: 'var(--paper)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', color: 'var(--ink)' }

  const eyebrowColor = dark ? 'var(--orange)' : 'var(--orange-deep)'
  const metaColor    = dark ? 'rgba(245,239,228,0.7)' : 'rgba(27,42,36,0.7)'
  const subMetaColor = dark ? 'rgba(245,239,228,0.55)' : 'rgba(27,42,36,0.55)'
  const priceColor   = dark ? 'var(--orange)' : 'var(--ink)'

  const comingSoon = course.status === 'COMING_SOON'
  const options = optionsForCourse(course)
  const fromPrice = options.length ? Math.min(...options.map((o) => o.priceCents)) / 100 : null
  const formatLabel = course.format === 'VIDEO_AND_BOOKLET' ? 'Videos & booklets' : 'Booklets only'

  return (
    <div
      className="card-lift"
      style={{
        ...surface,
        borderRadius: 16,
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
        opacity: comingSoon ? 0.75 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: eyebrowColor }}>
          {course.subject} · {formatLabel}
        </div>
        {comingSoon && (
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap',
            background: dark ? 'rgba(245,239,228,0.14)' : 'rgba(27,42,36,0.08)', color: dark ? 'rgba(245,239,228,0.75)' : 'var(--fg-2)',
          }}>
            Coming soon
          </div>
        )}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: dark ? 'var(--chalk)' : 'var(--ink)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        {course.title}
      </h3>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: metaColor }}>
        {course.year} · {course.schedule}
      </div>
      {!comingSoon && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: subMetaColor, letterSpacing: '0.04em' }}>from</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 28, color: priceColor }}>{fromPrice != null ? `€${fromPrice}` : '—'}</div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {comingSoon ? (
          <Button variant="secondary" size="sm" onDark={dark} disabled>Coming soon</Button>
        ) : (
          <Button variant="primary" size="sm" href={`/enrol?course=${course.id}`}>Enrol now</Button>
        )}
      </div>
    </div>
  )
}
