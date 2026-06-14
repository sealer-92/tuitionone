import { db } from '@/lib/db'

export const metadata = { title: 'Enrolments — Admin' }

export default async function AdminEnrolmentsPage() {
  const purchases = await db.purchase.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, phone: true, address: true } },
      course: { select: { title: true, subject: true, year: true } },
    },
  })

  const cell: React.CSSProperties = { padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', verticalAlign: 'top' }
  const head: React.CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 28px' }}>Enrolments</h1>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Student', 'Parent', 'Email', 'Phone', 'Address', 'Course', 'Amount', 'Date'].map((h) => (
                <th key={h} style={head}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ ...cell, fontWeight: 600 }}>{p.studentName ?? '—'}</td>
                <td style={cell}>{p.user.name ?? '—'}</td>
                <td style={cell}>{p.user.email}</td>
                <td style={cell}>{p.user.phone ?? '—'}</td>
                <td style={{ ...cell, whiteSpace: 'pre-wrap', maxWidth: 220 }}>{p.user.address ?? '—'}</td>
                <td style={cell}>{p.course.title}<div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{p.course.subject} · {p.course.year}</div></td>
                <td style={{ ...cell, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>€{(p.amountCents / 100).toFixed(0)}</td>
                <td style={{ ...cell, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{p.createdAt.toLocaleDateString('en-IE')}</td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>No enrolments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
