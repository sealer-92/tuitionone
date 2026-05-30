import { AuthSignInForm } from '@/components/AuthSignInForm'

export const metadata = {
  title: 'Sign In — Tuition One',
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--container-pad)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 12 }}>
            Student Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            Sign in to Tuition One
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--fg-2)', marginTop: 12 }}>
            We&apos;ll send a sign-in link to your email. No password needed.
          </p>
        </div>

        {searchParams.error === 'AccessDenied' && (
          <div style={{ background: 'rgba(181,72,60,0.08)', border: '1px solid rgba(181,72,60,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 14, color: '#B5483C' }}>
            No account found. You need to purchase a course before signing in.{' '}
            <a href="/courses" style={{ color: '#B5483C', fontWeight: 600, textDecoration: 'underline' }}>Browse courses →</a>
          </div>
        )}

        <AuthSignInForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </section>
  )
}
