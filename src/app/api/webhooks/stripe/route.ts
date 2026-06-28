import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { writeAuditLog } from '@/lib/access'
import { PurchaseOption } from '@prisma/client'
import Stripe from 'stripe'

const VALID_OPTIONS: PurchaseOption[] = ['FULL', 'FULL_PHYSICAL', 'DIGITAL_BOOKLET', 'PHYSICAL_BOOKLET']

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

    if (!courseId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Idempotency: skip if already processed
    const existing = await db.purchase.findUnique({ where: { stripeSessionId: session.id } })
    if (existing?.status === 'COMPLETED') {
      return NextResponse.json({ received: true })
    }

    const email = session.customer_details?.email
    if (!email) return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
    // Prefer the details captured on our enrol form; fall back to Stripe's.
    const parentName  = session.metadata?.parentName  || session.customer_details?.name || ''
    const phone       = session.metadata?.parentPhone || session.customer_details?.phone || null
    const studentName = session.metadata?.studentName || null
    const rawOption   = session.metadata?.option as PurchaseOption | undefined
    const option      = rawOption && VALID_OPTIONS.includes(rawOption) ? rawOption : 'FULL'
    const shipLine1   = session.metadata?.shipLine1   || null
    const shipLine2   = session.metadata?.shipLine2   || null
    const shipCity    = session.metadata?.shipCity    || null
    const shipCounty  = session.metadata?.shipCounty  || null
    const shipEircode = session.metadata?.shipEircode || null

    // Find or create the account holder (the paying parent), keeping their details current.
    const user = await db.user.upsert({
      where:  { email },
      update: {
        name: parentName || undefined, phone: phone || undefined,
        addressLine1: shipLine1 || undefined, addressLine2: shipLine2 || undefined,
        city: shipCity || undefined, county: shipCounty || undefined, eircode: shipEircode || undefined,
      },
      create: {
        email, name: parentName, phone, role: 'STUDENT',
        addressLine1: shipLine1, addressLine2: shipLine2, city: shipCity, county: shipCounty, eircode: shipEircode,
      },
    })

    // Update or create the purchase record
    await db.purchase.upsert({
      where: { stripeSessionId: session.id },
      update: {
        userId:                user.id,
        studentName,
        option,
        shipLine1, shipLine2, shipCity, shipCounty, shipEircode,
        status:                'COMPLETED',
        stripePaymentIntentId: session.payment_intent as string,
      },
      create: {
        userId:                user.id,
        courseId,
        studentName,
        option,
        shipLine1, shipLine2, shipCity, shipCounty, shipEircode,
        stripeSessionId:       session.id,
        stripePaymentIntentId: session.payment_intent as string,
        amountCents:           session.amount_total ?? 0,
        currency:              session.currency ?? 'eur',
        status:                'COMPLETED',
      },
    })

    // Record the terms consent accepted during checkout, and audit the purchase.
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    await db.consentLog.create({
      data: { userId: user.id, type: 'TERMS', version: '1.0', ipAddress: ip },
    })
    await writeAuditLog(user.id, 'purchase_completed', 'Purchase', session.id, ip, {
      courseId,
      amountCents: session.amount_total ?? 0,
    })

    await sendMagicLinkEmail(email, parentName)
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
