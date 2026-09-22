import Link from 'next/link'
import { LegalPage, LegalContact, LegalSection } from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = {
  title: 'Privacy Policy — Tuition One',
  description: 'How Tuition One Grinds collects, uses and protects your personal data under the GDPR, and the rights you have over it.',
}

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: (
      <>
        <p>
          {LEGAL.tradingName} is the <strong>data controller</strong> for the personal data described here. We are based
          in Ireland, and we handle your data under the General Data Protection Regulation (GDPR) and the Irish Data
          Protection Acts 1988–2018.
        </p>
        <p>This policy explains what we collect, why, how long we keep it, and what you can ask us to do with it.</p>
        <LegalContact />
      </>
    ),
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: (
      <>
        <h3>Details you give us</h3>
        <ul>
          <li>Parent or guardian name, email address and mobile number.</li>
          <li>Student name.</li>
          <li>Delivery address, including Eircode, so printed booklets can be posted.</li>
          <li>Anything you write to us in a support message.</li>
        </ul>

        <h3>Details created by your purchase</h3>
        <ul>
          <li>Which course and option you bought, the amount, the currency and the date.</li>
          <li>Stripe&apos;s reference for the payment. <strong>We never see or store your card number</strong> — Stripe handles the card itself.</li>
          <li>A record that you accepted these policies at checkout, with the date and the IP address it came from.</li>
        </ul>

        <h3>Details created by using the site</h3>
        <ul>
          <li>An access log of which videos and booklets were opened from your account, with the date and IP address. We keep this to protect the material from being shared, and to help us support you.</li>
          <li>Anonymous page views — the page, the referring page and a random identifier held in your browser for the visit only. It is not a cookie and is not linked to you.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'why-we-use-it',
    heading: 'Why we use it, and our legal basis',
    body: (
      <>
        <ul>
          <li><strong>To give you what you bought</strong> — creating your account, emailing your sign-in link, granting access, posting booklets. Legal basis: performance of our contract with you.</li>
          <li><strong>To take payment and prevent fraud</strong> — through Stripe. Legal basis: performance of our contract, and our legitimate interest in preventing fraudulent payments.</li>
          <li><strong>To support you</strong> — answering your questions and fixing problems. Legal basis: performance of our contract, and our legitimate interest in running the service well.</li>
          <li><strong>To protect the course material</strong> — the content access log above. Legal basis: our legitimate interest in preventing our material from being copied and shared.</li>
          <li><strong>To understand how the site is used</strong> — anonymous, aggregated page views. Legal basis: our legitimate interest in improving the site.</li>
          <li><strong>To meet our legal duties</strong> — keeping records of sales for tax. Legal basis: legal obligation.</li>
        </ul>
        <p>
          We do not sell your personal data, we do not use it for automated decision-making or profiling, and we do not
          send marketing emails unless you have asked us to. If we ever do, every message will have a one-click
          unsubscribe and you can withdraw consent at any time.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies and analytics',
    body: (
      <>
        <p>
          We use a <strong>strictly necessary</strong> cookie to keep you signed in after you click your sign-in link,
          and a short-lived one to protect forms against cross-site request forgery. These are required for the site to
          work and cannot be turned off.
        </p>
        <p>
          Our own page-view counting does not use cookies at all. It stores a random identifier in your browser&apos;s
          session storage, which is cleared when you close the tab, so we can count a visit without identifying you.
        </p>
        <p>
          We also use Vercel Analytics and Vercel Speed Insights to measure traffic and page performance. Both are
          cookie-free and designed not to identify individual visitors.
        </p>
      </>
    ),
  },
  {
    id: 'who-we-share-with',
    heading: 'Who we share it with',
    body: (
      <>
        <p>
          We do not sell or rent your data. We share it only with the service providers who make the site work, each
          acting as our processor under a written agreement, and only with what they need:
        </p>
        <ul>
          <li><strong>Stripe</strong> — payment processing. Stripe is a controller in its own right for card data. See <a href="https://stripe.com/ie/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s privacy policy</a>.</li>
          <li><strong>Vercel</strong> — website hosting, the database that stores your account, and analytics.</li>
          <li><strong>Resend</strong> — sending your sign-in links and service emails.</li>
          <li><strong>Cloudflare R2</strong> — storing the course videos and booklets.</li>
          <li><strong>Upstash</strong> — rate limiting, to stop automated abuse of checkout and sign-in.</li>
          <li><strong>An Post or a courier</strong> — your delivery address, only when a printed booklet is being posted to you.</li>
        </ul>
        <p>
          We may also disclose data where the law requires it, or to establish or defend a legal claim. If our business
          were ever transferred to someone else, your data would move with it and we would tell you first.
        </p>
      </>
    ),
  },
  {
    id: 'transfers',
    heading: 'Where your data is held',
    body: (
      <>
        <p>
          <strong>Your data is stored and processed in the European Economic Area.</strong> Several of our providers are
          global companies, so where a service offered a choice of region we selected an EU one — the database, the file
          storage holding the course material, the rate limiting and the email delivery are all configured to keep data
          within the EEA.
        </p>
        <p>
          Stripe is a separate controller for payment data and operates internationally under its own safeguards; see
          its <a href="https://stripe.com/ie/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> for
          details. Should we ever need to move any other processing outside the EEA, we would update this policy first
          and rely on an adequacy decision of the European Commission or the EU Standard Contractual Clauses.
        </p>
      </>
    ),
  },
  {
    id: 'how-long',
    heading: 'How long we keep it',
    body: (
      <>
        <ul>
          <li><strong>Your account</strong> — for as long as you have one. Ask us to delete it and we mark it deleted immediately; it is permanently erased within 30 days.</li>
          <li><strong>Sales and payment records</strong> — six years, because Revenue requires us to keep them.</li>
          <li><strong>Content access and security logs</strong> — up to 12 months, then deleted.</li>
          <li><strong>Support messages</strong> — up to two years after the issue is closed.</li>
          <li><strong>Page-view counts</strong> — kept in aggregate; they contain nothing that identifies you.</li>
        </ul>
        <p>
          Where we must keep a sales record after you delete your account, we keep only what the tax rules require and
          nothing more.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: (
      <>
        <p>Under the GDPR you can ask us to:</p>
        <ul>
          <li><strong>give you a copy</strong> of the personal data we hold about you;</li>
          <li><strong>correct</strong> anything that is wrong or out of date;</li>
          <li><strong>delete</strong> your data, where we have no overriding reason to keep it;</li>
          <li><strong>restrict</strong> or <strong>object to</strong> how we use it, including anything we do on the basis of legitimate interests;</li>
          <li><strong>port</strong> it — send you, or another provider, a machine-readable copy;</li>
          <li><strong>withdraw consent</strong> at any time, where consent is what we relied on.</li>
        </ul>
        <p>
          If you have an account, the quickest route is to sign in — your dashboard can export your data and request
          deletion directly. Otherwise, email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. We reply within one
          month, and we never charge for a request unless it is clearly excessive or repetitive.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    heading: 'Students under 18',
    body: (
      <p>
        Our courses are written for second-level students, most of whom are under 18, but accounts are opened and paid
        for by an adult. The data we hold about a student is limited to their name and the course they are taking; we do
        not ask students for their own contact details and we do not market to them. If you believe we hold data about a
        child that we should not, email us and we will remove it.
      </p>
    ),
  },
  {
    id: 'security',
    heading: 'How we protect it',
    body: (
      <p>
        The site runs over HTTPS. There are no passwords to steal — signing in uses a one-time link that expires after 24
        hours and works once. Course videos and booklets are served through short-lived private links rather than public
        URLs, access to your data is limited to the people who run the service, and sign-in and checkout are rate limited
        against automated abuse. No system is perfectly secure, but if a breach ever put your rights at risk we would
        notify the Data Protection Commission within 72 hours and tell you without undue delay.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <p>
        We will update this policy when what we do changes. The date at the top shows the last revision. If a change
        materially affects how we use your data, we will tell you by email.
      </p>
    ),
  },
  {
    id: 'complaints',
    heading: 'Questions and complaints',
    body: (
      <>
        <p>
          Talk to us first — email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we will do our best to put it
          right. You also have the right to complain to the Irish supervisory authority:
        </p>
        <p>
          <strong>Data Protection Commission</strong><br />
          21 Fitzwilliam Square South, Dublin 2, D02 RD28<br />
          <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>
        </p>
        <p>
          See also our <Link href="/terms">Terms of Service</Link> and
          our <Link href="/refunds">Refund &amp; Cancellation Policy</Link>.
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What personal data we collect, why we need it, how long we keep it, and the rights you have over it."
      sections={sections}
    />
  )
}
