import { db } from '@/lib/db'

export const metadata = { title: 'Users — Admin' }

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { purchases: true } } },
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 28px' }}>Users</h1>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Email', 'Name', 'Role', 'Purchases', 'Joined'].map((h) => (
                <th key={h} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', opacity: u.deletedAt ? 0.5 : 1 }}>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)' }}>{u.name ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: u.role === 'ADMIN' ? 'rgba(229,143,63,0.16)' : 'rgba(27,42,36,0.08)', color: u.role === 'ADMIN' ? 'var(--orange-deep)' : 'var(--fg-2)' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>{u._count.purchases}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>{u.createdAt.toLocaleDateString('en-IE')}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
