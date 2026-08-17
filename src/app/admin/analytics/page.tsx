import { db } from '@/lib/db'

export const metadata = { title: 'Analytics — Admin' }

const DAYS = 30
const TREND_DAYS = 14

function startOfDaysAgo(days: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - (days - 1))
  return d
}

export default async function AdminAnalyticsPage() {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - DAYS)
  const trendSince = startOfDaysAgo(TREND_DAYS)

  const [totalViews, sessions, newUsers, revenue, topPaths, dailyRows] = await Promise.all([
    db.pageView.count({ where: { createdAt: { gte: since } } }),
    db.pageView.findMany({ where: { createdAt: { gte: since } }, select: { sessionId: true }, distinct: ['sessionId'] }),
    db.user.count({ where: { createdAt: { gte: since }, deletedAt: null } }),
    db.purchase.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: since } }, _sum: { amountCents: true } }),
    db.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: since } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    db.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "createdAt") as day, count(*)::bigint as count
      FROM "PageView"
      WHERE "createdAt" >= ${trendSince}
      GROUP BY day
      ORDER BY day ASC
    `,
  ])

  const dailyByKey = new Map(dailyRows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.count)]))
  const trend = Array.from({ length: TREND_DAYS }, (_, i) => {
    const d = new Date(trendSince)
    d.setUTCDate(d.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    return { date: d, count: dailyByKey.get(key) ?? 0 }
  })
  const maxCount = Math.max(1, ...trend.map((t) => t.count))

  const stat = (label: string, value: string | number) => (
    <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--ink)' }}>{value}</div>
    </div>
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 4px' }}>Analytics</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', margin: '0 0 28px' }}>Last {DAYS} days</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
        {stat('Page views', totalViews.toLocaleString('en-IE'))}
        {stat('Unique visitors', sessions.length.toLocaleString('en-IE'))}
        {stat('New sign-ups', newUsers.toLocaleString('en-IE'))}
        {stat('Revenue', `€${((revenue._sum.amountCents ?? 0) / 100).toLocaleString('en-IE')}`)}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Page views, last {TREND_DAYS} days</h2>
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 20px 16px', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
          {trend.map((t) => {
            const key = t.date.toISOString().slice(0, 10)
            const isMax = t.count === maxCount && maxCount > 0
            return (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                {isMax && (
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--orange-deep)', marginBottom: 4 }}>{t.count}</div>
                )}
                <div
                  title={`${t.date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}: ${t.count} view${t.count === 1 ? '' : 's'}`}
                  style={{
                    width: '100%',
                    maxWidth: 24,
                    height: `${Math.max(2, (t.count / maxCount) * 92)}%`,
                    background: 'var(--orange)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {trend.map((t, i) => (
            <div key={t.date.toISOString()} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--fg-3)' }}>
              {i % 2 === 0 ? t.date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) : ''}
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 16px' }}>Top pages</h2>
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Path', 'Views'].map((h) => (
                <th key={h} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: h === 'Views' ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPaths.length === 0 ? (
              <tr><td colSpan={2} style={{ padding: '20px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)' }}>No page views recorded yet.</td></tr>
            ) : (
              topPaths.map((p) => (
                <tr key={p.path} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>{p.path}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>{p._count.path.toLocaleString('en-IE')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
