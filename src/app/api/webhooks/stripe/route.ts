import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Stripe requires the raw body — we use req.text() to get it before parsing
async function sendMagicLinkEmail(email: string, name: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY!)
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: 'Your Tuition One account is ready',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1B2A24;">Welcome to Tuition One, ${name || 'there'}!</h2>
        <p style="color: rgba(27,42,36,0.72);">
          Your course purchase is confirmed. Click below to sign in and access your course materials.
        </p>
        <a href="${process.env.NEXTAUTH_URL}/auth/signin"
           style="display:inline-block;background:#E58F3F;color:white;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;margin-top:8px;">
          Access my courses
        </a>
        <p style="color:rgba(27,42,36,0.52);font-size:13px;margin-top:24px;">
          Questions? Reply to this email or WhatsApp us on 087 069 2287.
        </p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const courseId = session.metadata?.courseId
    const tier     = session.metadata?.tier as 'NOTES_ONLY' | 'FULL'

    if (!courseId || !tier) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Idempotency: skip if already processed
    const existing = await db.purchase.findUnique({ where: { stripeSessionId: session.id } })
    if (existing?.status === 'COMPLETED') {
      return NextResponse.json({ received: true })
    }

    const email    = session.customer_details?.email!
    const name     = session.customer_details?.name ?? ''

    // Find or create user
    let user = await db.user.findUnique({ where: { email } })
    if (!user) {
      user = await db.user.create({ data: { email, name, role: 'STUDENT' } })
    }

    // Update or create the purchase record
    await db.purchase.upsert({
      where: { stripeSessionId: session.id },
      update: {
        userId:                user.id,
        status:                'COMPLETED',
        stripePaymentIntentId: session.payment_intent as string,
      },
      create: {
        userId:                user.id,
        courseId,
        tier,
        stripeSessionId:       session.id,
        stripePaymentIntentId: session.payment_intent as string,
        amountCents:           session.amount_total ?? 0,
        currency:              session.currency ?? 'eur',
        status:                'COMPLETED',
      },
    })

    await sendMagicLinkEmail(email, name)
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    await db.purchase.updateMany({
      where: { stripePaymentIntentId: charge.payment_intent as string },
      data:  { status: 'REFUNDED' },
    })
  }

  return NextResponse.json({ received: true })
}
