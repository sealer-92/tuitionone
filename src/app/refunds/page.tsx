import Link from 'next/link'
import { LegalPage, LegalContact, LegalSection } from '@/components/LegalPage'
import { LEGAL } from '@/lib/legal'

export const metadata = {
  title: 'Refund & Cancellation Policy — Tuition One',
  description: 'How cancellations and refunds work at Tuition One Grinds, including your 14-day right to cancel under Irish and EU consumer law.',
}

const sections: LegalSection[] = [
  {
    id: 'summary',
    heading: 'The short version',
    body: (
      <>
        <div className="legal-callout">
          <p>
            <strong>Printed booklets:</strong> 14 days from delivery to change your mind and send them back.<br />
            <strong>Online course access:</strong> you ask for access immediately at checkout, which ends the 14-day
            right for that part — but if the course is faulty, mis-described, or you have barely opened it, talk to us.
          </p>
        </div>
        <p>
          We would much rather sort a problem out than leave you with a course you cannot use. Email
          us at <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we will look at it properly.
        </p>
      </>
    ),
  },
  {
    id: 'statutory-rights',
    heading: 'Your rights under Irish and EU law',
    body: (
      <>
        <p>
          When you buy online from a trader in Ireland you are buying at a distance, so the European Union (Consumer
          Information, Cancellation and Other Rights) Regulations 2013 and the Consumer Rights Act 2022 apply. Among
          other things, they give you:
        </p>
        <ul>
          <li>a <strong>14-day cooling-off period</strong> in which you can cancel most distance purchases without giving a reason;</li>
          <li>the right to goods and digital content that match their description, are of satisfactory quality, and are fit for purpose;</li>
          <li>the right to a repair, replacement, price reduction or refund if they are not.</li>
        </ul>
        <p>
          Nothing in this policy takes those rights away. Where this policy and your statutory rights differ, your
          statutory rights win.
        </p>
      </>
    ),
  },
  {
    id: 'online-access',
    heading: 'Cancelling online course access',
    body: (
      <>
        <p>
          The law lets you give up the 14-day cooling-off period for digital content so that you can start using it
          straight away, rather than waiting two weeks. Because our courses open the moment your payment clears, you are
          asked at checkout to:
        </p>
        <ul>
          <li>expressly request that we supply your course immediately, and</li>
          <li>acknowledge that doing so ends your right to cancel that digital content once access has begun.</li>
        </ul>
        <p>
          Once you have that access, the 14-day right no longer applies to it. That is not the end of the matter,
          though — the rest of this policy still applies, and so do your rights if something is wrong with the course.
        </p>
        <h3>If you cancel before access begins</h3>
        <p>
          If you cancel within 14 days and before your sign-in link has been used, we will refund you in full. Email us
          from the address on the order and we will take care of it.
        </p>
      </>
    ),
  },
  {
    id: 'printed-booklets',
    heading: 'Cancelling a printed booklet',
    body: (
      <>
        <p>
          A printed booklet is a physical good, so your 14-day right to cancel runs from the day it is delivered to you.
          You do not need to give a reason. Tell us within those 14 days and then return the booklet to us
          within 14 days of telling us.
        </p>
        <ul>
          <li>The booklet must come back in a resaleable condition — unmarked, unannotated and complete.</li>
          <li>You pay the cost of returning it, unless it arrived damaged or was not what you ordered.</li>
          <li>We recommend a tracked service; until it reaches us, the booklet is your responsibility.</li>
        </ul>
        <p>
          We refund the price of the booklet, plus standard delivery if you paid for it, within 14 days of receiving it
          back (or of proof that you sent it). If you bought the combined course-and-booklet option, we refund the
          booklet portion of the price — the online access is covered by the section above.
        </p>
        <p>
          A booklet that arrives damaged, incomplete or wrongly addressed by us is replaced or refunded in full at no
          cost to you. Tell us as soon as you notice.
        </p>
      </>
    ),
  },
  {
    id: 'something-wrong',
    heading: 'If something is wrong with the course',
    body: (
      <>
        <p>These are not cooling-off cases — they are faults, and we fix them. Contact us if:</p>
        <ul>
          <li>a video will not play, or content is missing, corrupted or duplicated;</li>
          <li>the course is materially different from how it was described when you bought it;</li>
          <li>you cannot sign in and we cannot get you signed in;</li>
          <li>you were charged twice for the same course, or charged in error.</li>
        </ul>
        <p>
          Our first step is to put the problem right — fix the content, resend your sign-in link, or correct the email
          address on the account. If we cannot, you are entitled to a price reduction or a refund. A duplicate or
          mistaken charge is always refunded in full, and you do not need to ask twice.
        </p>
      </>
    ),
  },
  {
    id: 'wrong-email',
    heading: 'If you used the wrong email address',
    body: (
      <>
        <div className="legal-callout">
          <p>
            A mistyped email address is not a reason to lose your course. Email
            us at <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> from either address and we will move the purchase
            to the right one.
          </p>
        </div>
        <p>
          Your sign-in link is sent to the address entered at checkout, so a typo means the link goes nowhere useful. We
          can correct it — we may ask for proof of payment, such as the Stripe receipt, before we do.
        </p>
      </>
    ),
  },
  {
    id: 'goodwill',
    heading: 'Beyond your statutory rights',
    body: (
      <>
        <p>
          We look at every refund request on its merits, even where the strict legal position is that the sale is final.
          If you have just bought a course, barely opened it, and it is plainly not what you need, get in touch within 14
          days and tell us what happened — we would rather find a fair answer, whether that is a refund, a switch to a
          different course, or more time.
        </p>
        <p>
          What we will not do is refund a course that has been substantially worked through, or a printed booklet that
          has been written in, and we may decline repeat requests from the same account.
        </p>
      </>
    ),
  },
  {
    id: 'how-to-request',
    heading: 'How to request a refund',
    body: (
      <>
        <p>
          Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> with the subject &ldquo;Refund request&rdquo; and include:
        </p>
        <ul>
          <li>the email address used at checkout;</li>
          <li>the course and option you bought, and roughly when;</li>
          <li>what you would like us to do, and why.</li>
        </ul>
        <p>
          You are welcome to use the standard cancellation form set out in the 2013 Regulations, but a plain email is
          enough. You can also message us on WhatsApp at <a href={LEGAL.whatsapp}>{LEGAL.phone}</a>, though we will ask
          you to confirm by email so there is a record.
        </p>
        <p>
          We reply within {LEGAL.responseDays} working days. Approved refunds go back to the card or payment method you
          paid with, through Stripe, within 14 days of us agreeing the refund. Your bank may take a few days more to
          show it. We never charge a fee for processing a refund.
        </p>
      </>
    ),
  },
  {
    id: 'subscriptions',
    heading: 'Subscriptions and recurring payments',
    body: (
      <p>
        There are none. Every course is a single, one-off payment — nothing renews, and there is no subscription to
        cancel. If you ever see a repeat charge from us, tell us immediately and we will refund it.
      </p>
    ),
  },
  {
    id: 'chargebacks',
    heading: 'Chargebacks',
    body: (
      <p>
        Please come to us before raising a chargeback with your bank. A chargeback takes weeks and usually ends with the
        same answer we would have given you in a day. While a chargeback is open, we may suspend access to the course it
        relates to. If you believe a payment on your card was not made by you, contact your bank straight away and tell
        us too.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact and complaints',
    body: (
      <>
        <LegalContact />
        <p>
          If you are unhappy with how we have handled a refund, see the complaints section of
          our <Link href="/terms#complaints">Terms of Service</Link>, which explains how to escalate to the Competition
          and Consumer Protection Commission or the European Consumer Centre.
        </p>
      </>
    ),
  },
]

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro="How to cancel, when you are entitled to a refund, and how to ask for one."
      sections={sections}
    />
  )
}
