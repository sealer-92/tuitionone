import { db } from '@/lib/db'

export const metadata = { title: 'Admin — Tuition One' }

export default async function AdminOverviewPage() {
  const [users, purchases, courses] = await Promise.all([
    db.user.count({ where: { deletedAt: null } }),
    db.purchase.count({ where: { status: 'COMPLETED' } }),
    db.course.count({ where: { status: 'ACTIVE' } }),
  ])

  const recentPurchases = await db.purchase.findMany({
    where: { status: 'COMPLETED' },
    include: { user: true, course: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const stat = (label: string, value: number | string) => (
    <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--ink)' }}>{value}</div>
    </div>
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 28px' }}>Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
        {stat('Active users', users)}
        {stat('Total purchases', purchases)}
        {stat('Active courses', courses)}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Recent purchases</h2>
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Student', 'Course', 'Tier', 'Amount', 'Date'].map((h) => (
                <th key={h} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPurchases.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>{p.user.email}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>{p.course.title}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: p.tier === 'FULL' ? 'rgba(92,138,78,0.16)' : 'rgba(229,143,63,0.14)', color: p.tier === 'FULL' ? 'var(--leaf-deep)' : 'var(--orange-deep)' }}>
                    {p.tier === 'FULL' ? 'Full' : 'Notes'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>€{(p.amountCents / 100).toFixed(0)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{p.createdAt.toLocaleDateString('en-IE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
