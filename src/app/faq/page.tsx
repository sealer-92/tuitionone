import { HelpCircle } from 'lucide-react'
import { Section } from '@/components/Section'
import { FaqItem } from '@/components/FaqItem'
import { ContactBlock } from '@/components/ContactBlock'

export const metadata = {
  title: 'FAQs — Tuition One',
  description: 'Answers to common questions about course pricing, paying by card, accessing your videos and notes, and signing in with an email link.',
}

const categories: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Pricing',
    items: [
      {
        q: 'How much do the courses cost?',
        a: 'Pricing starts from €150 and varies by subject and the option you choose. Pick a course on the Enrol page to see the exact price for each option.',
      },
      {
        q: "What's the difference between the course options?",
        a: 'Full course access includes every video lesson plus the study notes. Booklet-only options give you just the notes, either as a digital download or a printed copy posted to your home — priced accordingly.',
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
        q: 'How do I access my videos and notes after purchasing?',
        a: 'Sign in using the link emailed to you, then go to "My Modules" in your dashboard — every video and note you\'ve purchased is organised there by module.',
      },
      {
        q: 'Can I watch on any device?',
        a: "Yes — everything is 100% online, so you can watch and read on your phone, tablet or laptop, anytime, and pause, rewind or revisit lessons as often as you like.",
      },
      {
        q: 'I paid for a printed booklet — when will it arrive?',
        a: "We'll post it to the delivery address you gave at checkout and be in touch to confirm timing. If you also chose the digital booklet, that's available in your dashboard as soon as you sign in.",
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

export default function FaqPage() {
  return (
    <>
      <Section
        eyebrow="FAQs"
        eyebrowIcon={<HelpCircle size={16} />}
        title="Frequently asked questions"
        subtitle="Everything you need to know about pricing, payment, accessing your course, and signing in."
      >
        <div style={{ display: 'grid', gap: 44, maxWidth: 760 }}>
          {categories.map((cat) => (
            <div key={cat.title}>
              <h2 style={{
                fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange-deep)',
                margin: '0 0 8px',
              }}>
                {cat.title}
              </h2>
              <div>
                {cat.items.map((item) => (
                  <FaqItem key={item.q} question={item.q}>
                    <p style={{ margin: 0 }}>{item.a}</p>
                  </FaqItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section dark eyebrow="Still have questions?" title="We're happy to help">
        <ContactBlock dark />
      </Section>
    </>
  )
}
