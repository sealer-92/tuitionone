import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AdminModuleManager } from '@/components/admin/AdminModuleManager'
import { CourseForm } from '@/components/admin/CourseForm'

export const metadata = { title: 'Edit course — Admin' }

const fromCents = (c: number | null): number | '' => (c == null ? '' : c / 100)

export default async function AdminCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { order: 'asc' }, include: { contentItems: { orderBy: { createdAt: 'asc' } } } },
      _count: { select: { purchases: true } },
    },
  })
  if (!course) notFound()

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/admin/courses" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)', textDecoration: 'none' }}>Courses</Link>
        <ChevronRight size={14} style={{ margin: '0 4px', color: 'var(--fg-3)', verticalAlign: 'middle' }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>{course.title}</span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '8px 0 4px' }}>{course.title}</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', margin: '0 0 28px' }}>
        {course.status} · {course._count.purchases} purchases
      </p>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Course settings &amp; pricing</h2>
      <CourseForm initial={{
        id: course.id,
        title: course.title,
        slug: course.slug,
        subject: course.subject,
        year: course.year,
        schedule: course.schedule,
        weeks: course.weeks,
        status: course.status,
        description: course.description ?? '',
        format: course.format,
        fullPriceEuros: fromCents(course.fullPriceCents),
        fullPhysicalPriceEuros: fromCents(course.fullPhysicalPriceCents),
        digitalBookletPriceEuros: fromCents(course.digitalBookletPriceCents),
        physicalBookletPriceEuros: fromCents(course.physicalBookletPriceCents),
      }} />

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '40px 0 16px' }}>Modules &amp; content</h2>
      <AdminModuleManager courseId={course.id} modules={course.modules} />
    </div>
  )
}
