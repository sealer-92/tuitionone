import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin?callbackUrl=/admin')
  if (session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: 220, background: 'var(--chalkboard-deep)', color: 'var(--chalk)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 16px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange)' }}>
          Admin
        </div>
        <nav className="admin-nav">
          {[
            { href: '/admin',            label: 'Overview' },
            { href: '/admin/courses',    label: 'Courses' },
            { href: '/admin/enrolments', label: 'Enrolments' },
            { href: '/admin/support',    label: 'Support' },
            { href: '/admin/users',      label: 'Users' },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: 'block', padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'rgba(245,239,228,0.8)', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 'clamp(24px, 4vw, 48px)', background: 'var(--paper)', overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
