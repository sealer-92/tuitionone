import { db } from '@/lib/db'
import { TicketStatusButton } from '@/components/admin/TicketStatusButton'

export const metadata = { title: 'Support — Admin' }

export default async function AdminSupportPage() {
  const tickets = await db.supportTicket.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { name: true, email: true } } },
  })

  const cell: React.CSSProperties = { padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', verticalAlign: 'top' }
  const head: React.CSSProperties = { fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 28px' }}>Support</h1>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Status', 'From', 'Subject', 'Message', 'Date', ''].map((h) => <th key={h} style={head}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', background: t.status === 'OPEN' ? 'rgba(229,143,63,0.05)' : undefined }}>
                <td style={cell}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: t.status === 'OPEN' ? 'rgba(229,143,63,0.16)' : 'rgba(92,138,78,0.16)', color: t.status === 'OPEN' ? 'var(--orange-deep)' : 'var(--leaf-deep)' }}>
                    {t.status}
                  </span>
                </td>
                <td style={cell}>{t.user.name ?? '—'}<div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{t.user.email}</div></td>
                <td style={{ ...cell, fontWeight: 600 }}>{t.subject}</td>
                <td style={{ ...cell, whiteSpace: 'pre-wrap', maxWidth: 360 }}>{t.message}</td>
                <td style={{ ...cell, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{t.createdAt.toLocaleDateString('en-IE')}</td>
                <td style={cell}><TicketStatusButton id={t.id} status={t.status} /></td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>No support issues yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
