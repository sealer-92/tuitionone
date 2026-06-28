import { db } from '@/lib/db'
import { needsShipping } from '@/lib/options'
import { PurchaseOption } from '@prisma/client'

export const metadata = { title: 'Enrolments — Admin' }

const OPTION_LABEL: Record<PurchaseOption, string> = {
  FULL: 'Videos + digital',
  FULL_PHYSICAL: 'Videos + digital + printed',
  DIGITAL_BOOKLET: 'Digital booklet',
  PHYSICAL_BOOKLET: 'Printed booklet',
}

export default async function AdminEnrolmentsPage() {
  const purchases = await db.purchase.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      course: { select: { title: true, subject: true, year: true } },
    },
  })

  const cell: React.CSSProperties = { padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', verticalAlign: 'top' }
  const head: React.CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 28px' }}>Enrolments</h1>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Student', 'Parent', 'Email', 'Phone', 'Course', 'Option', 'Ship to', 'Amount', 'Date'].map((h) => (
                <th key={h} style={head}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => {
              const shipping = needsShipping(p.option)
              const address = [p.shipLine1, p.shipLine2, p.shipCity, p.shipCounty, p.shipEircode].filter(Boolean).join(', ')
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: shipping ? 'rgba(229,143,63,0.05)' : undefined }}>
                  <td style={{ ...cell, fontWeight: 600 }}>{p.studentName ?? '—'}</td>
                  <td style={cell}>{p.user.name ?? '—'}</td>
                  <td style={cell}>{p.user.email}</td>
                  <td style={cell}>{p.user.phone ?? '—'}</td>
                  <td style={cell}>{p.course.title}<div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{p.course.subject} · {p.course.year}</div></td>
                  <td style={cell}>
                    {OPTION_LABEL[p.option]}
                    {shipping && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--orange-deep)', marginTop: 2 }}>📦 Post booklet</div>}
                  </td>
                  <td style={{ ...cell, whiteSpace: 'pre-wrap', maxWidth: 220 }}>{shipping ? (address || '—') : '—'}</td>
                  <td style={{ ...cell, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>€{(p.amountCents / 100).toFixed(0)}</td>
                  <td style={{ ...cell, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{p.createdAt.toLocaleDateString('en-IE')}</td>
                </tr>
              )
            })}
            {purchases.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>No enrolments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
