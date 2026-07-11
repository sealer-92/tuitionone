import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Check your email — Tuition One',
}

export default function VerifyPage() {
  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--container-pad)' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Mail size={28} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>
          Check your email
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', margin: 0 }}>
          We&apos;ve sent a sign-in link to your email address. Click the link in the email to sign in — it expires in 24 hours.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-3)', marginTop: 20 }}>
          Didn&apos;t get it? Check your spam folder, or{' '}
          <a href="/auth/signin" style={{ color: 'var(--orange-deep)', fontWeight: 600 }}>try again</a>.
        </p>
      </div>
    </section>
  )
}
