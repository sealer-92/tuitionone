import Image from 'next/image'
import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { HeaderNav } from './HeaderNav'

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(251, 247, 239, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(27,42,36,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px var(--container-pad)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, border: 0, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Image src="/tuition-one-logo.png" alt="Tuition One" width={36} height={36} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', color: 'var(--ink)', lineHeight: 1.05 }}>
            TUITION ONE
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--leaf)', letterSpacing: '0.22em', marginTop: 2 }}>GRINDS</div>
          </div>
        </Link>

        <HeaderNav />

        {/* Right side: auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user.role === 'ADMIN' && (
              <Link href="/admin" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--leaf-deep)', textDecoration: 'none' }}>
                Admin
              </Link>
            )}
            <Link href="/dashboard" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>
              My Courses
            </Link>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
              <button type="submit" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}>
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/auth/signin" style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14,
            padding: '10px 20px', borderRadius: 10,
            border: '1.5px solid var(--sage-tan)',
            color: 'var(--ink)', textDecoration: 'none',
            transition: 'border-color 120ms ease',
          }}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
