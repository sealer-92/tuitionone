export const metadata = {
  title: 'Sign-in error — Tuition One',
}

const messages: Record<string, string> = {
  AccessDenied: 'No account found for that email. You need to purchase a course before signing in.',
  Verification: 'The sign-in link has expired or has already been used. Please request a new one.',
  Default: 'Something went wrong with sign-in. Please try again.',
}

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const message = messages[error ?? 'Default'] ?? messages.Default

  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--container-pad)' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>
          Sign-in failed
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', margin: '0 0 24px' }}>
          {message}
        </p>
        <a href="/auth/signin" style={{ display: 'inline-block', background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, padding: '12px 24px', borderRadius: 12, textDecoration: 'none' }}>
          Back to sign in
        </a>
      </div>
    </section>
  )
}
