import { db } from '@/lib/db'
import Link from 'next/link'

export const metadata = { title: 'Courses — Admin' }

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { modules: true, purchases: true } } },
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Courses</h1>
        <Link href="/admin/courses/new" style={{ background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
          + New course
        </Link>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Title', 'Subject', 'Status', 'Modules', 'Purchases', 'Notes €', 'Full €', ''].map((h) => (
                <th key={h} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{c.title}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)' }}>{c.subject}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: c.status === 'ACTIVE' ? 'rgba(92,138,78,0.16)' : 'rgba(27,42,36,0.08)', color: c.status === 'ACTIVE' ? 'var(--leaf-deep)' : 'var(--fg-3)' }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>{c._count.modules}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>{c._count.purchases}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>€{(c.notesPrice / 100).toFixed(0)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink)' }}>€{(c.fullPrice / 100).toFixed(0)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/admin/courses/${c.id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--orange-deep)', textDecoration: 'none' }}>Edit</Link>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--fg-3)' }}>No courses yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
