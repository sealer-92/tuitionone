'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Video, Package } from 'lucide-react'
import { PurchaseOption } from '@prisma/client'
import { grantsNotes, grantsVideo, needsShipping } from '@/lib/options'
import { SUBJECT_BANNERS, SUBJECT_BANNER_FALLBACK, SUBJECT_BANNER_PATTERN } from '@/lib/subjectBanner'

export interface ModulePurchase {
  id: string
  option: PurchaseOption
  course: {
    id: string
    slug: string
    title: string
    subject: string
    year: string
    weeks: number
    schedule: string
    modules: { id: string; contentItems: { type: string }[] }[]
  }
}

const OPTION_LABEL: Record<PurchaseOption, string> = {
  FULL: 'Full access',
  FULL_PHYSICAL: 'Full access + post',
  DIGITAL_BOOKLET: 'Booklets only',
  PHYSICAL_BOOKLET: 'Printed booklet',
}

function ModuleCard({ purchase, index }: { purchase: ModulePurchase; index: number }) {
  const { course, option } = purchase
  const canVideo = grantsVideo(option)
  const canNotes = grantsNotes(option)
  const totalVideos = course.modules.reduce((n, m) => n + m.contentItems.filter((c) => c.type === 'VIDEO').length, 0)
  const totalNotes  = course.modules.reduce((n, m) => n + m.contentItems.filter((c) => c.type === 'NOTES').length, 0)

  return (
    <Link
      href={`/dashboard/course/${course.id}`}
      className="module-card card-lift"
      style={{ '--stagger-i': index } as React.CSSProperties}
      aria-label={`${course.title} — open course`}
    >
      <div className="module-card-banner">
        <div style={{ background: `${SUBJECT_BANNER_PATTERN}, ${SUBJECT_BANNERS[course.subject] ?? SUBJECT_BANNER_FALLBACK}` }} aria-hidden="true">
          <span style={{
            position: 'absolute', left: 18, bottom: 14,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.92)',
          }}>
            {course.subject}
          </span>
        </div>
      </div>

      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.25 }}>
          {course.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 12.5, color: 'var(--fg-3)', margin: '0 0 14px',
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.06em' }}>{course.slug.replace(/-/g, '_').toUpperCase()}</span>
          <span aria-hidden="true" style={{ fontSize: 8 }}>●</span>
          <span>{course.year}</span>
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {canNotes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <BookOpen size={13} aria-hidden="true" />{totalNotes} booklets
            </span>
          )}
          {canVideo && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <Video size={13} aria-hidden="true" />{totalVideos} videos
            </span>
          )}
          {!canVideo && !canNotes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <Package size={13} aria-hidden="true" />Posted to you
            </span>
          )}
          <span style={{
            marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
            padding: '3px 10px', borderRadius: 999,
            background: needsShipping(option) ? 'rgba(229,143,63,0.16)' : 'rgba(92,138,78,0.16)',
            color: needsShipping(option) ? 'var(--orange-deep)' : 'var(--leaf-deep)',
          }}>
            {OPTION_LABEL[option]}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ModulesGrid({ purchases }: { purchases: ModulePurchase[] }) {
  const years = [...new Set(purchases.map((p) => p.course.year))]
  const [active, setActive] = useState('All')
  const visible = active === 'All' ? purchases : purchases.filter((p) => p.course.year === active)

  return (
    <div>
      {years.length > 1 && (
        <div className="module-tabs" role="tablist" aria-label="Filter courses by year group">
          {['All', ...years].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={tab === active}
              className="module-tab"
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div
        // Keyed by tab so cards replay their entrance when the filter changes.
        key={active}
        className="stagger"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 22 }}
      >
        {visible.map((p, i) => (
          <ModuleCard key={p.id} purchase={p} index={i} />
        ))}
      </div>
    </div>
  )
}
