import { Compass } from 'lucide-react'
import { Button } from '@/components/Button'

export const metadata = {
  title: 'Page not found — Tuition One',
  description: 'The page you were looking for could not be found.',
}

export default function NotFound() {
  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--container-pad)' }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Compass size={28} />
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 12 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>
          Page not found
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', margin: '0 0 28px' }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" href="/">Back to home</Button>
          <Button variant="secondary" href="/courses">Browse courses</Button>
        </div>
      </div>
    </section>
  )
}
