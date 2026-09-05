import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen, Video, Package } from 'lucide-react'
import { grantsBooklet, grantsVideo } from '@/lib/options'
import { getThumbnailSignedUrl } from '@/lib/r2'
import { moduleFallbackPhotoUrl } from '@/lib/modulePhoto'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { BookletViewer } from '@/components/BookletViewer'

type ModuleWithVideos = {
  id: string
  order: number
  title: string
  thumbnailUrl: string | null
  videoCount: number
}

const EMPTY = <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', margin: 0 }}>Nothing here yet — check back soon.</p>

function ModuleList({ courseId, modules }: { courseId: string; modules: ModuleWithVideos[] }) {
  const withVideos = modules.filter((m) => m.videoCount > 0)
  if (withVideos.length === 0) return EMPTY

  return (
    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
      {withVideos.map((mod, i) => (
        <Link
          key={mod.id}
          href={`/dashboard/course/${courseId}/module/${mod.id}`}
          className="module-tile card-lift"
          style={{ ['--stagger-i' as string]: i }}
        >
          <div className="module-tile-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- presigned R2 URL / third-party photo, not a static/optimizable asset */}
            <img src={mod.thumbnailUrl ?? moduleFallbackPhotoUrl(mod.id)} alt="" loading="lazy" />
          </div>
          <div className="module-tile-body">
            <div className="module-tile-title">{mod.title}</div>
            <div className="module-tile-meta">
              Module {mod.order} · {mod.videoCount === 1 ? '1 video' : `${mod.videoCount} videos`}
            </div>
          </div>
        </Link>
      ))}
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

  const canVideo   = purchases.some((p) => grantsVideo(p.option))
  const canBooklet = purchases.some((p) => grantsBooklet(p.option))

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { contentItems: true } } },
      },
      booklets: { orderBy: { order: 'asc' } },
    },
  })
  if (!course) notFound()

  const modules: ModuleWithVideos[] = await Promise.all(
    course.modules.map(async (m) => ({
      id: m.id,
      order: m.order,
      title: m.title,
      thumbnailUrl: m.thumbnailKey ? await getThumbnailSignedUrl(m.thumbnailKey) : null,
      videoCount: m._count.contentItems,
    })),
  )

  const videoCount = modules.reduce((n, m) => n + m.videoCount, 0)

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

      {!canVideo && !canBooklet ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {canBooklet && (
            <CollapsibleSection
              title="Booklets"
              icon={<BookOpen size={20} />}
              meta={course.booklets.length === 1 ? '1 booklet' : `${course.booklets.length} booklets`}
            >
              {course.booklets.length === 0 ? EMPTY : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {course.booklets.map((b) => <BookletViewer key={b.id} bookletId={b.id} title={b.title} />)}
                </div>
              )}
            </CollapsibleSection>
          )}
          {canVideo && (
            <CollapsibleSection
              title="Videos"
              icon={<Video size={20} />}
              meta={videoCount === 1 ? '1 video' : `${videoCount} videos`}
            >
              <ModuleList courseId={course.id} modules={modules} />
            </CollapsibleSection>
          )}
        </div>
      )}
    </section>
  )
}
