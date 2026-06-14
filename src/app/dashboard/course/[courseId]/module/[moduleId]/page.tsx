import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { VideoPlayer } from '@/components/VideoPlayer'
import { NotesPdfViewer } from '@/components/NotesPdfViewer'

export default async function ModulePage({ params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const { courseId, moduleId } = await params

  const purchase = await db.purchase.findFirst({
    where: { userId: session.user.id, courseId, status: 'COMPLETED' },
  })
  if (!purchase) notFound()

  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { contentItems: { orderBy: { createdAt: 'asc' } }, course: true },
  })
  if (!mod || mod.courseId !== courseId) notFound()

  const notes  = mod.contentItems.filter((i) => i.type === 'NOTES')
  const videos = mod.contentItems.filter((i) => i.type === 'VIDEO')

  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) var(--container-pad)' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', textDecoration: 'none' }}>My Courses</Link>
        <ChevronRight size={14} style={{ margin: '0 4px', color: 'var(--fg-3)', verticalAlign: 'middle' }} />
        <Link href={`/dashboard/course/${courseId}`} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', textDecoration: 'none' }}>{mod.course.title}</Link>
        <ChevronRight size={14} style={{ margin: '0 4px', color: 'var(--fg-3)', verticalAlign: 'middle' }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>Module {mod.order}</span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 34px)', color: 'var(--ink)', margin: '12px 0 36px' }}>
        {mod.title}
      </h1>

      {notes.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Notes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notes.map((item) => <NotesPdfViewer key={item.id} itemId={item.id} title={item.title} />)}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Videos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {videos.map((item) => <VideoPlayer key={item.id} itemId={item.id} title={item.title} durationSeconds={item.durationSeconds} />)}
          </div>
        </div>
      )}
    </section>
  )
}
