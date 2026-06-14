import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen, Video } from 'lucide-react'

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const { courseId } = await params

  const purchase = await db.purchase.findFirst({
    where: { userId: session.user.id, courseId, status: 'COMPLETED' },
  })
  if (!purchase) notFound()

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {course.modules.map((mod) => (
          <Link key={mod.id} href={`/dashboard/course/${course.id}/module/${mod.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(229,143,63,0.12)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                {mod.order}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{mod.title}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {mod.contentItems.filter((i) => i.type === 'NOTES').length > 0 && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BookOpen size={12} />{mod.contentItems.filter((i) => i.type === 'NOTES').length} notes
                    </span>
                  )}
                  {mod.contentItems.filter((i) => i.type === 'VIDEO').length > 0 && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fg-3)' }}>
                      <Video size={12} />
                      {mod.contentItems.filter((i) => i.type === 'VIDEO').length} videos
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
