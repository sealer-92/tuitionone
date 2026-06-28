import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { checkoutRateLimit } from '@/lib/ratelimit'
import { optionsForCourse, priceForOption, needsShipping, isValidEircode, normalizeEircode } from '@/lib/options'
import { PurchaseOption } from '@prisma/client'

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
  const { courseId, option, parentName, parentEmail, parentPhone, studentName, line1, line2, city, county, eircode } = body as {
    courseId?: string
    option?: PurchaseOption
    parentName?: string
    parentEmail?: string
    parentPhone?: string
    studentName?: string
    line1?: string
    line2?: string
    city?: string
    county?: string
    eircode?: string
  }

  if (!courseId || !option) {
    return NextResponse.json({ error: 'Missing course or option' }, { status: 400 })
  }

  // Address is required for every purchase (printed booklets are posted).
  if (!line1 || !city || !county || !eircode || !isValidEircode(eircode)) {
    return NextResponse.json({ error: 'A valid delivery address with Eircode is required' }, { status: 400 })
  }

  const course = await db.course.findUnique({ where: { id: courseId, status: 'ACTIVE' } })
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  // Authoritative price from the chosen option; never trust a client-supplied amount.
  const unitAmount = priceForOption(course, option)
  if (unitAmount == null) {
    return NextResponse.json({ error: 'That option is not available for this course' }, { status: 400 })
  }

  const optionLabel = optionsForCourse(course).find((o) => o.option === option)?.label ?? course.title

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
            description: optionLabel,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    // Enrolment details are echoed back to us via the webhook (Stripe metadata values max 500 chars).
    metadata: {
      courseId,
      option,
      parentName:  parentName?.slice(0, 500) ?? '',
      parentPhone: parentPhone?.slice(0, 500) ?? '',
      studentName: studentName?.slice(0, 500) ?? '',
      shipLine1:   line1?.slice(0, 500) ?? '',
      shipLine2:   line2?.slice(0, 500) ?? '',
      shipCity:    city?.slice(0, 500) ?? '',
      shipCounty:  county?.slice(0, 500) ?? '',
      shipEircode: normalizeEircode(eircode),
      needsShipping: needsShipping(option) ? '1' : '0',
    },
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/courses`,
    customer_creation: 'always',
  })

  return NextResponse.json({ url: session.url })
}
