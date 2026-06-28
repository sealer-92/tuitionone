import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen, Video, Package } from 'lucide-react'
import { grantsNotes, grantsVideo } from '@/lib/options'

type ModuleWithItems = {
  id: string
  order: number
  title: string
  contentItems: { type: string }[]
}

function ModuleList({ courseId, modules, type }: { courseId: string; modules: ModuleWithItems[]; type: 'VIDEO' | 'NOTES' }) {
  const withContent = modules.filter((m) => m.contentItems.some((i) => i.type === type))
  if (withContent.length === 0) {
    return <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0 }}>Nothing here yet — check back soon.</p>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {withContent.map((mod) => {
        const count = mod.contentItems.filter((i) => i.type === type).length
        return (
          <Link key={mod.id} href={`/dashboard/course/${courseId}/module/${mod.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(229,143,63,0.12)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                {mod.order}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{mod.title}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  {type === 'VIDEO' ? <Video size={12} /> : <BookOpen size={12} />}
                  {count} {type === 'VIDEO' ? (count === 1 ? 'video' : 'videos') : (count === 1 ? 'booklet' : 'booklets')}
                </div>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const { courseId } = await params

  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id, courseId, status: 'COMPLETED' },
    select: { option: true },
  })
  if (purchases.length === 0) notFound()

  const canVideo = purchases.some((p) => grantsVideo(p.option))
  const canNotes = purchases.some((p) => grantsNotes(p.option))

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { contentItems: { orderBy: { createdAt: 'asc' } } },
      },
    },
  })
  if (!course) notFound()

  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) var(--container-pad)' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', textDecoration: 'none' }}>
          My Courses
        </Link>
        <ChevronRight size={14} style={{ margin: '0 4px', color: 'var(--fg-3)', verticalAlign: 'middle' }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>{course.subject}</span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--ink)', margin: '12px 0 6px' }}>
        {course.title}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', margin: '0 0 36px' }}>
        {course.year} · {course.schedule} · {course.weeks}-week course
      </p>

      {!canVideo && !canNotes ? (
        <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 30px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(229,143,63,0.12)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>Printed booklet ordered</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--fg-2)', margin: 0 }}>
              Your printed booklet will be posted to the address you provided at checkout. This purchase doesn&apos;t include online videos or digital booklets.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {canNotes && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={20} /> Booklets
              </h2>
              <ModuleList courseId={course.id} modules={course.modules} type="NOTES" />
            </div>
          )}
          {canVideo && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={20} /> Videos
              </h2>
              <ModuleList courseId={course.id} modules={course.modules} type="VIDEO" />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
