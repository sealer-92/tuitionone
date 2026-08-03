import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen, Video, Package } from 'lucide-react'
import { grantsNotes, grantsVideo } from '@/lib/options'
import { getThumbnailSignedUrl } from '@/lib/r2'
import { SUBJECT_BANNERS, SUBJECT_BANNER_FALLBACK, SUBJECT_BANNER_PATTERN } from '@/lib/subjectBanner'

type ModuleWithItems = {
  id: string
  order: number
  title: string
  thumbnailUrl: string | null
  contentItems: { type: string }[]
}

function ModuleList({ courseId, modules, type, subject }: { courseId: string; modules: ModuleWithItems[]; type: 'VIDEO' | 'NOTES'; subject: string }) {
  const withContent = modules.filter((m) => m.contentItems.some((i) => i.type === type))
  if (withContent.length === 0) {
    return <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0 }}>Nothing here yet — check back soon.</p>
  }
  return (
    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
      {withContent.map((mod, i) => {
        const count = mod.contentItems.filter((i) => i.type === type).length
        return (
          <Link
            key={mod.id}
            href={`/dashboard/course/${courseId}/module/${mod.id}`}
            className="module-tile card-lift"
            style={{ ['--stagger-i' as string]: i }}
          >
            <div className="module-tile-thumb">
              {mod.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- presigned R2 URL, not a static/optimizable asset
                <img src={mod.thumbnailUrl} alt="" loading="lazy" />
              ) : (
                <div style={{ background: `${SUBJECT_BANNER_PATTERN}, ${SUBJECT_BANNERS[subject] ?? SUBJECT_BANNER_FALLBACK}` }} aria-hidden="true">
                  <span className="module-tile-number">{mod.order}</span>
                </div>
              )}
              <span className="module-tile-count">
                {type === 'VIDEO' ? <Video size={12} /> : <BookOpen size={12} />}
                {count}
              </span>
            </div>
            <div className="module-tile-body">
              <div className="module-tile-title">{mod.title}</div>
              <div className="module-tile-meta">
                {type === 'VIDEO' ? (count === 1 ? '1 video' : `${count} videos`) : (count === 1 ? '1 booklet' : `${count} booklets`)}
              </div>
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

  const modules: ModuleWithItems[] = await Promise.all(
    course.modules.map(async (m) => ({
      id: m.id,
      order: m.order,
      title: m.title,
      thumbnailUrl: m.thumbnailKey ? await getThumbnailSignedUrl(m.thumbnailKey) : null,
      contentItems: m.contentItems,
    })),
  )

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
        {course.year} · {course.schedule}
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
              <ModuleList courseId={course.id} modules={modules} type="NOTES" subject={course.subject} />
            </div>
          )}
          {canVideo && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={20} /> Videos
              </h2>
              <ModuleList courseId={course.id} modules={modules} type="VIDEO" subject={course.subject} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
