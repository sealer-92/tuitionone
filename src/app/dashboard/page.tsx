import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DashboardCourseCard } from '@/components/DashboardCourseCard'

export const metadata = { title: 'My Courses — Tuition One' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    include: { course: { include: { modules: { include: { contentItems: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) var(--container-pad)' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 10 }}>
          Student portal
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--ink)', margin: 0 }}>
          My Courses
        </h1>
      </div>

      {purchases.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-2)' }}>
          <p>You haven&apos;t purchased any courses yet.</p>
          <a href="/courses" style={{ color: 'var(--orange-deep)', fontWeight: 600 }}>Browse courses →</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {purchases.map((p) => (
            <DashboardCourseCard key={p.id} purchase={p} />
          ))}
        </div>
      )}
    </section>
  )
}
