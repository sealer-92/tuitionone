'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Course } from '@/lib/courses'
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

  const statusMap = {
    open:     { bg: dark ? 'rgba(92,138,78,0.25)' : 'rgba(92,138,78,0.16)', fg: dark ? '#B5DDA3' : 'var(--leaf-deep)', label: 'Enrolling' },
    filling:  { bg: dark ? 'rgba(229,143,63,0.22)' : 'rgba(229,143,63,0.18)', fg: dark ? 'var(--orange-soft)' : 'var(--orange-deep)', label: `${course.spots} spots left` },
    waitlist: { bg: dark ? 'rgba(245,239,228,0.10)' : 'rgba(27,42,36,0.08)', fg: dark ? 'rgba(245,239,228,0.7)' : 'rgba(27,42,36,0.55)', label: 'Waitlist only' },
  }
  const status = statusMap[course.status]

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
      {course.featured && (
        <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)', background: dark ? 'rgba(229,143,63,0.18)' : 'rgba(229,143,63,0.14)', padding: '4px 10px', borderRadius: 999 }}>
          Most popular
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: eyebrowColor }}>
        {course.weeks}-week course · {course.subject}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: dark ? 'var(--chalk)' : 'var(--ink)', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        {course.title}
      </h3>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: metaColor }}>
        {course.year} · {course.day} · {course.time}
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: status.bg, color: status.fg, width: 'max-content' }}>
        ● {status.label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 28, color: priceColor }}>€{course.price}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: subMetaColor, letterSpacing: '0.04em' }}>/ {course.weeks} weeks</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="primary" size="sm" href={`/enrol?course=${course.id}`}>Reserve a place</Button>
        <Button variant="ghost" size="sm" onDark={dark}>Details →</Button>
      </div>
    </div>
  )
}
