import Link from 'next/link'
import { LegalPage, LegalContact, LegalSection } from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = {
  title: 'Terms of Service — Tuition One',
  description: 'The terms on which Tuition One Grinds sells and provides online video courses and course booklets to students in Ireland.',
}

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: (
      <>
        <p>
          {LEGAL.siteName} is an online tuition service trading as <strong>{LEGAL.tradingName}</strong>, based in Ireland.
          We sell online video courses and course booklets for Leaving Certificate and Junior Cycle students.
        </p>
        <p>
          In these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; mean {LEGAL.tradingName}.
          &ldquo;You&rdquo; means the person who buys a course or uses this website.
        </p>
        <LegalContact />
      </>
    ),
  },
  {
    id: 'these-terms',
    heading: 'These terms',
    body: (
      <>
        <p>
          These terms apply when you buy a course from us or use this website. By placing an order or signing in, you
          agree to them. Please read them before you pay — if you do not agree to them, please do not place an order.
        </p>
        <p>
          Two other documents form part of these terms:
          our <Link href="/refunds">Refund &amp; Cancellation Policy</Link> and
          our <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          Nothing in these terms limits your rights as a consumer under Irish or EU law. Where a term conflicts with
          those rights, your statutory rights take precedence.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    heading: 'Who can buy a course',
    body: (
      <>
        <p>
          You must be at least 18 years old to buy a course. Our courses are written for second-level students, most of
          whom are under 18, so the purchase is normally made by a parent or guardian on the student&apos;s behalf.
        </p>
        <p>
          If you are buying for someone under 18, you are responsible for the account, for payment, and for the
          student&apos;s use of the material under these terms.
        </p>
      </>
    ),
  },
  {
    id: 'account',
    heading: 'Your account and signing in',
    body: (
      <>
        <div className="legal-callout">
          <p>
            <strong>Your email address is your account.</strong> There is no password — we email you a one-time sign-in
            link instead. If the email address you give at checkout is wrong or mistyped, the sign-in link goes to the
            wrong place and the course cannot be opened. Please check it carefully before paying.
          </p>
        </div>
        <p>
          An account is created automatically when your payment is confirmed, using the email address you entered at
          checkout. Enter the address belonging to the person who will actually watch the videos and read the booklets.
        </p>
        <p>
          Sign-in links expire 24 hours after they are sent and can only be used once. Your account and the material in
          it are personal to you and may not be shared, sold or transferred.
        </p>
        <p>
          If you entered the wrong email address, email us at <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> from
          either address and we will correct it. We may ask for proof of payment before changing the address on an account.
        </p>
      </>
    ),
  },
  {
    id: 'what-you-get',
    heading: 'What you are buying',
    body: (
      <>
        <p>Each course is sold as a one-off purchase. Depending on the option you choose, it includes:</p>
        <ul>
          <li><strong>Online course</strong> — every video lesson in the course, plus the digital course booklet, both available in your dashboard.</li>
          <li><strong>Online course + printed booklet</strong> — as above, plus a printed copy of the booklet posted to your delivery address.</li>
          <li><strong>Digital booklet only</strong> — online access to the digital booklet, with no video lessons.</li>
          <li><strong>Printed booklet only</strong> — a printed booklet posted to you, with no online access.</li>
        </ul>
        <p>
          Exactly what is included is shown on the course page and again on the confirmation step before you pay. The
          price you see at checkout is the total price in euro, including any tax that applies. There is no recurring
          charge, subscription or auto-renewal.
        </p>
        <p>
          Course descriptions, module counts and timetables are given in good faith but may change as material is added
          or revised. We do not guarantee any particular exam result or grade.
        </p>
      </>
    ),
  },
  {
    id: 'access',
    heading: 'Your access',
    body: (
      <>
        <p>
          Online access begins as soon as your payment is confirmed and the sign-in link reaches your inbox, and
          continues for at least {LEGAL.accessMonths} months from the date of purchase.
        </p>
        <p>
          In practice we keep courses online for as long as they remain current. If we decide to withdraw a course you
          have bought before the {LEGAL.accessMonths} months are up, we will email you first and either extend access,
          give you the material in another form, or refund you a fair share of what you paid.
        </p>
        <p>
          We do our best to keep the site available, but we cannot promise it will never be down. Maintenance, faults or
          problems at one of our suppliers can interrupt access. Short interruptions of this kind are not a breach of
          these terms.
        </p>
      </>
    ),
  },
  {
    id: 'orders-and-payment',
    heading: 'Orders and payment',
    body: (
      <>
        <p>
          Your order is an offer to buy. A contract forms when your payment is confirmed and we email your sign-in link.
          If we cannot accept your order we will tell you and refund any payment in full.
        </p>
        <p>
          Payments are taken by Stripe. We never see or store your card details — read Stripe&apos;s
          own <a href="https://stripe.com/ie/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> for
          how it handles them. All prices are in euro (EUR).
        </p>
        <p>
          Each account may buy a given course once. If you try to buy a course your email address already owns, checkout
          will stop and tell you — sign in instead, or contact us if something looks wrong.
        </p>
        <p>
          Prices can change at any time, but a change never affects an order you have already paid for. If a course is
          listed at an obviously incorrect price, we may cancel the order and refund you in full rather than supply it at
          that price.
        </p>
      </>
    ),
  },
  {
    id: 'printed-booklets',
    heading: 'Printed booklets and delivery',
    body: (
      <>
        <p>
          Printed booklets are posted within Ireland only, to the delivery address and Eircode you give at checkout.
          Please make sure they are correct — we cannot recover a booklet sent to an address you typed incorrectly, and a
          replacement may have to be paid for.
        </p>
        <p>
          We will be in touch to confirm postage after you order. Delivery timescales depend on the postal service and
          are estimates rather than promises. Risk in a printed booklet passes to you when it is delivered to your address.
        </p>
        <p>
          If a booklet arrives damaged, or does not arrive at all, tell us within a reasonable time and we will replace it
          or refund it.
        </p>
      </>
    ),
  },
  {
    id: 'cancellation',
    heading: 'Cancellation and refunds',
    body: (
      <>
        <p>
          Your right to cancel, and how refunds work, are set out in full in
          our <Link href="/refunds">Refund &amp; Cancellation Policy</Link>, which forms part of these terms.
        </p>
        <p>
          In short: as a consumer buying at a distance you normally have 14 days to change your mind. Because online
          course access is digital content supplied immediately, you are asked at checkout to consent to that immediate
          access and to acknowledge that doing so ends the 14-day right for that content. The 14-day right still applies
          to printed booklets, from the day they are delivered.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'How you may use the material',
    body: (
      <>
        <p>
          We give you a personal, non-exclusive, non-transferable licence to use the videos and booklets for the
          student&apos;s own study, for as long as you have access. You may print or download a booklet for that purpose.
        </p>
        <p>You may not:</p>
        <ul>
          <li>share, resell, publish, broadcast or lend the material, or your sign-in link, to anyone else;</li>
          <li>record, screen-capture, download or copy the video lessons, or circumvent any access control;</li>
          <li>use the material for commercial purposes, including teaching it to others for payment;</li>
          <li>upload the material to any file-sharing, messaging or social platform;</li>
          <li>scrape the site, use it through automated tools, or attempt to access another person&apos;s account.</li>
        </ul>
        <p>
          We log content access against your account. If we have good reason to believe material is being shared, we may
          suspend the account while we look into it.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    body: (
      <p>
        All course videos, booklets, notes, worked solutions, branding and website content belong to us or to our
        licensors, and are protected by copyright. Buying a course buys access to it under the licence above; it does not
        transfer ownership of anything. State examination papers and marking schemes referred to in the material remain
        the property of their respective owners.
      </p>
    ),
  },
  {
    id: 'suspension',
    heading: 'Suspension and termination',
    body: (
      <>
        <p>
          We may suspend or close an account that breaches these terms, particularly the rules on sharing material, or
          where we reasonably suspect fraudulent payment. Where it is fair to do so we will warn you first and give you a
          chance to put things right.
        </p>
        <p>
          If we close your account because you have breached these terms, you may not be entitled to a refund. If we
          close it for any other reason, we will refund a fair share of what you paid for access you have lost.
        </p>
        <p>
          You can stop using the service at any time and ask us to delete your account — see
          our <Link href="/privacy">Privacy Policy</Link>. Deleting an account ends your access to purchased material.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    heading: 'Our responsibility to you',
    body: (
      <>
        <p>
          If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable
          result of that failure. We are not responsible for loss or damage that is not foreseeable.
        </p>
        <p>
          We do not exclude or limit our liability in any way where it would be unlawful to do so. This includes
          liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, and
          for any of your rights as a consumer that cannot be excluded.
        </p>
        <p>
          Subject to that, our total liability to you in connection with a course is limited to the amount you paid for
          it. We supply our courses for private study only; we accept no liability for business losses, or for exam
          results, course choices or academic outcomes.
        </p>
      </>
    ),
  },
  {
    id: 'complaints',
    heading: 'Complaints',
    body: (
      <>
        <p>
          If something has gone wrong, email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> with your name, the email
          address on the account and what happened. We will acknowledge your complaint
          within {LEGAL.responseDays} working days and try to resolve it quickly.
        </p>
        <p>
          If we cannot settle it between us, you can contact
          the <a href="https://www.ccpc.ie" target="_blank" rel="noopener noreferrer">Competition and Consumer Protection Commission</a> or,
          if you live in another EU country,
          the <a href="https://www.eccireland.ie" target="_blank" rel="noopener noreferrer">European Consumer Centre Ireland</a>.
          Your right to take a claim to court is unaffected.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time — for example, to reflect a change in what we offer or in the law.
        The version published here when you place an order is the one that applies to that order. The date at the top of
        this page shows when it last changed.
      </p>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of Ireland, and you and we both agree that the courts of Ireland have
        jurisdiction over any dispute. If you live in another EU country, you keep the benefit of any mandatory consumer
        protections of that country and may bring proceedings there.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The terms on which we sell and provide our online courses and booklets. Please read them before you buy."
      sections={sections}
    />
  )
}
