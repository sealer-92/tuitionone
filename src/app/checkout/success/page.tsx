import { Check, Mail, Package } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { grantsBooklet, needsShipping } from '@/lib/options'

export const metadata = {
  title: 'Payment confirmed — Tuition One',
  description: 'Your Tuition One payment has been confirmed.',
  robots: { index: false, follow: false },
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const purchase = session_id
    ? await db.purchase.findUnique({ where: { stripeSessionId: session_id }, select: { option: true } })
    : null

  // Every purchase comes with a booklet of some kind, so show the card whenever
  // there is something to say about it.
  const hasDigital   = !!purchase && grantsBooklet(purchase.option)
  const hasShipping  = !!purchase && needsShipping(purchase.option)

  return (
    <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--container-pad)' }}>
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(92,138,78,0.16)', color: 'var(--leaf-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={36} strokeWidth={2.5} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, color: 'var(--ink)', margin: '0 0 14px' }}>
          Payment confirmed!
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.65, color: 'var(--fg-2)', margin: '0 0 32px' }}>
          Your place is secured. We&apos;ve sent a sign-in link to your email address — click it to access your course materials.
        </p>

        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={20} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Check your inbox</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', marginTop: 2 }}>
              Your sign-in link is on its way. Check spam if you don&apos;t see it within a minute.
            </div>
          </div>
        </div>

        {(hasDigital || hasShipping) && (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(92,138,78,0.14)', color: 'var(--leaf-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>About your booklet</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', marginTop: 2 }}>
                {hasDigital && 'Your digital booklet is available online in your dashboard as soon as you sign in. '}
                {hasShipping && "We'll be in touch to confirm postage of your printed booklet."}
              </div>
            </div>
          </div>
        )}

        <Link href="/auth/signin" style={{ display: 'inline-block', background: 'var(--orange)', color: 'white', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none' }}>
          Sign in to my account
        </Link>
      </div>
    </section>
  )
}
