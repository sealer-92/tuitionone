import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { checkoutRateLimit } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    try {
      const { success } = await checkoutRateLimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    } catch {
      // Redis unavailable — allow the request through rather than blocking checkout
    }
  }

  const body = await req.json()
  const { courseId, parentName, parentEmail, parentPhone, studentName, address } = body as {
    courseId: string
    parentName?: string
    parentEmail?: string
    parentPhone?: string
    studentName?: string
    address?: string
  }

  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
  }

  const course = await db.course.findUnique({ where: { id: courseId, status: 'ACTIVE' } })
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: parentEmail || undefined,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: course.title,
            description: `${course.weeks}-week course · ${course.schedule}`,
          },
          unit_amount: course.price,
        },
        quantity: 1,
      },
    ],
    // Enrolment details are echoed back to us via the webhook (Stripe metadata values max 500 chars).
    metadata: {
      courseId,
      parentName:  parentName?.slice(0, 500) ?? '',
      parentPhone: parentPhone?.slice(0, 500) ?? '',
      studentName: studentName?.slice(0, 500) ?? '',
      address:     address?.slice(0, 500) ?? '',
    },
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/courses`,
    billing_address_collection: 'auto',
    customer_creation: 'always',
  })

  return NextResponse.json({ url: session.url })
}
