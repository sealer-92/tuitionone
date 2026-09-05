import { Section } from '@/components/Section'
import { FaqItem } from '@/components/FaqItem'
import { ContactBlock } from '@/components/ContactBlock'

export const metadata = {
  title: 'FAQs — Tuition One',
  description: 'Answers to common questions about course pricing, paying by card, accessing your videos, and signing in with an email link.',
}

const categories: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Pricing',
    items: [
      {
        q: 'How much do the courses cost?',
        a: 'The online course is €150, or €200 if you\'d like a printed booklet posted to you as well. Pick a course on the Enrol page to see it broken down before you pay.',
      },
      {
        q: "What's the difference between the two options?",
        a: 'Both include full access to every video lesson. The €200 option also posts you a printed course booklet. We don\'t currently offer a digital booklet — that\'s coming in a future release.',
      },
      {
        q: 'Which subjects are available right now?',
        a: 'Higher and Ordinary Level Maths, and Junior Cycle Maths (Higher Level), are open for enrolment today. Higher Level Chemistry, Higher Level Biology and Junior Cycle Science are coming soon — keep an eye on the Courses page.',
      },
    ],
  },
  {
    title: 'Payment',
    items: [
      {
        q: 'How do I pay?',
        a: "Payment is handled securely through Stripe. After entering your details and choosing a course, you're redirected to Stripe's checkout page to pay by card — we never see or store your card details.",
      },
      {
        q: 'Is it a one-time payment or a subscription?',
        a: "It's a single, one-time payment for the course you choose. There's no recurring subscription or auto-renewal.",
      },
      {
        q: 'What happens right after I pay?',
        a: "As soon as payment is confirmed, we email a sign-in link to the address you provided. If you chose a printed booklet, we'll also be in touch to confirm postage.",
      },
    ],
  },
  {
    title: 'Accessing your content',
    items: [
      {
        q: 'How do I access my videos after purchasing?',
        a: 'Sign in using the link emailed to you, then go to "My Modules" in your dashboard — every video you\'ve purchased is organised there by module.',
      },
      {
        q: 'Can I watch on any device?',
        a: "Yes — everything is 100% online, so you can watch on your phone, tablet or laptop, anytime, and pause, rewind or revisit lessons as often as you like.",
      },
      {
        q: 'I paid for a printed booklet — when will it arrive?',
        a: "We'll post it to the delivery address you gave at checkout and be in touch to confirm timing.",
      },
    ],
  },
  {
    title: 'Signing in',
    items: [
      {
        q: 'How do I sign in?',
        a: "There's no password to remember. Enter your email on the sign-in page and we'll send you a one-time sign-in link — just click it to be signed in.",
      },
      {
        q: 'Why does it say "No account found" when I try to sign in?',
        a: "Accounts are created automatically once a payment is confirmed, so you'll need to have purchased at least one course with that email address before you can sign in.",
      },
      {
        q: "My sign-in link isn't working.",
        a: 'Each link expires after 24 hours and can only be used once. Check your spam folder for a more recent one, or request a new link from the sign-in page.',
      },
    ],
  },
]

// A loose chalk swash that sits behind the heading, in place of the usual eyebrow.
function ChalkSwash() {
  return (
    <svg
      viewBox="0 0 900 240"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', overflow: 'visible',
      }}
    >
      <path
        d="M 176 206 C 330 178, 486 220, 640 190 S 758 166, 792 182"
        fill="none" stroke="var(--orange-soft)" strokeWidth="26" strokeLinecap="round" opacity="0.75"
      />
      <path
        d="M 196 226 C 348 202, 500 238, 652 210 S 762 190, 784 202"
        fill="none" stroke="var(--orange)" strokeWidth="8" strokeLinecap="round" opacity="0.42"
      />
    </svg>
  )
}

export default function FaqPage() {
  return (
    <>
      <section style={{ background: 'var(--cream)', padding: 'clamp(56px, 8vw, 104px) var(--container-pad) clamp(64px, 9vw, 120px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 88px)' }}>
            <div style={{ position: 'relative' }}>
              <ChalkSwash />
              <h1 style={{
                position: 'relative', zIndex: 1,
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: 'clamp(40px, 7vw, 76px)', lineHeight: 1.02, letterSpacing: '-0.02em',
                color: 'var(--ink)', margin: '0 auto', maxWidth: 760,
              }}>
                Frequently Asked Questions
              </h1>
            </div>
            <p style={{
              position: 'relative', zIndex: 1,
              fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6,
              color: 'var(--fg-2)', margin: '22px auto 0', maxWidth: 460,
            }}>
              Everything you need to know about pricing, payment, accessing your course, and signing in.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 56 }}>
            {categories.map((cat) => (
              <div key={cat.title}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.01em',
                  color: 'var(--ink)', margin: '0 0 18px',
                }}>
                  {cat.title}
                </h2>
                <div style={{
                  background: 'var(--paper)', borderRadius: 16,
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
                }}>
                  {cat.items.map((item, i) => (
                    <FaqItem key={item.q} question={item.q} isLast={i === cat.items.length - 1}>
                      <p style={{ margin: 0 }}>{item.a}</p>
                    </FaqItem>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section dark eyebrow="Still have questions?" title="We're happy to help">
        <ContactBlock dark />
      </Section>
    </>
  )
}
