import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ModulesGrid } from '@/components/ModulesGrid'
import { RaiseIssueForm } from '@/components/RaiseIssueForm'
import { DashboardGreeting } from '@/components/DashboardGreeting'

export const metadata = {
  title: 'My Modules — Tuition One',
  description: 'View the course videos and study notes you\'ve purchased.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: {
      id: true,
      option: true,
      studentName: true,
      course: {
        select: {
          id: true, slug: true, title: true, subject: true, year: true, weeks: true, schedule: true,
          modules: { select: { id: true, contentItems: { select: { type: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const firstName = (purchases[0]?.studentName ?? session.user.name ?? '').trim().split(/\s+/)[0] || null

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) var(--container-pad)' }}>
      <div className="rise-in" style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 10 }}>
          Student portal
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--ink)', margin: 0 }}>
          My Modules
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--fg-2)', marginTop: 8 }}>
          <DashboardGreeting name={firstName} />
        </p>
      </div>

      {purchases.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-2)' }}>
          <p>You haven&apos;t purchased any courses yet.</p>
          <Link href="/courses" style={{ color: 'var(--orange-deep)', fontWeight: 600 }}>Browse courses →</Link>
        </div>
      ) : (
        <ModulesGrid purchases={purchases} />
      )}

      <div style={{ marginTop: 40 }}>
        <RaiseIssueForm />
      </div>
    </section>
  )
}
