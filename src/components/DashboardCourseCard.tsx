'use client'

import Link from 'next/link'
import { BookOpen, Video, Package } from 'lucide-react'
import { PurchaseOption } from '@prisma/client'
import { grantsNotes, grantsVideo, needsShipping } from '@/lib/options'

interface Props {
  purchase: {
    id: string
    option: PurchaseOption
    course: {
      id: string
      title: string
      subject: string
      year: string
      weeks: number
      schedule: string
      modules: {
        id: string
        contentItems: { type: string }[]
      }[]
    }
  }
}

const OPTION_LABEL: Record<PurchaseOption, string> = {
  FULL: 'Full access',
  FULL_PHYSICAL: 'Full access + post',
  DIGITAL_BOOKLET: 'Booklets only',
  PHYSICAL_BOOKLET: 'Printed booklet',
}

export function DashboardCourseCard({ purchase }: Props) {
  const { course, option } = purchase
  const canVideo = grantsVideo(option)
  const canNotes = grantsNotes(option)
  const totalVideos = course.modules.reduce((n, m) => n + m.contentItems.filter((c) => c.type === 'VIDEO').length, 0)
  const totalNotes  = course.modules.reduce((n, m) => n + m.contentItems.filter((c) => c.type === 'NOTES').length, 0)

  return (
    <Link href={`/dashboard/course/${course.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 120ms ease, transform 120ms ease' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange-deep)', marginBottom: 8 }}>
          {course.subject} · {course.year}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2 }}>
          {course.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', margin: '0 0 16px' }}>
          {course.weeks}-week course · {course.schedule}
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {canNotes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <BookOpen size={13} />{totalNotes} booklets
            </span>
          )}
          {canVideo && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <Video size={13} />{totalVideos} videos
            </span>
          )}
          {!canVideo && !canNotes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>
              <Package size={13} />Posted to you
            </span>
          )}
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: needsShipping(option) ? 'rgba(229,143,63,0.16)' : 'rgba(92,138,78,0.16)', color: needsShipping(option) ? 'var(--orange-deep)' : 'var(--leaf-deep)' }}>
            {OPTION_LABEL[option]}
          </span>
        </div>
      </div>
    </Link>
  )
}
