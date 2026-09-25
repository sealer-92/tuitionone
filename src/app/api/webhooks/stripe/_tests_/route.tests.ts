import { describe, it, expect, vi, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import type Stripe from 'stripe'

// The signature check and email delivery are Stripe/Resend concerns — stub
// them so the test drives our fulfilment logic against the real local DB.
const constructEvent = vi.fn()
const send = vi.fn<(msg: { to: string; html: string }) => Promise<{ error: null }>>(async () => ({ error: null }))
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ webhooks: { constructEvent } }),
}))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))

import { POST } from '@/app/api/webhooks/stripe/route'
import { db } from '@/lib/db'
import { createHash } from 'node:crypto'

const run = Math.random().toString(36).slice(2, 8)
const EMAIL = `webhook.${run}@tests.example.com`

function completedSessionEvent(sessionId: string, courseId: string) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        payment_intent: `pi_${sessionId}`,
        amount_total: 15000,
        currency: 'eur',
        customer_details: { email: EMAIL, name: 'Webhook Parent', phone: null },
        metadata: {
          courseId,
          option: 'FULL',
          parentName: 'Webhook Parent',
          parentPhone: '0870000000',
          studentName: 'Webhook Student',
          shipLine1: '1 Main Street',
          shipLine2: '',
          shipCity: 'Carlow',
          shipCounty: 'Carlow',
          shipEircode: 'R93A1B2',
          needsShipping: '0',
        },
      },
    },
  } as unknown as Stripe.Event
}

function webhookRequest() {
  return new NextRequest('http://localhost:3000/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'stripe-signature': 'sig_test' },
    body: '{}',
  })
}

async function deliver(event: Stripe.Event) {
  constructEvent.mockReturnValueOnce(event)
  return POST(webhookRequest())
}

afterAll(async () => {
  await db.verificationToken.deleteMany({ where: { identifier: EMAIL } })
  const user = await db.user.findUnique({ where: { email: EMAIL } })
  if (user) {
    await db.auditLog.deleteMany({ where: { userId: user.id } })
    await db.consentLog.deleteMany({ where: { userId: user.id } })
    await db.purchase.deleteMany({ where: { userId: user.id } })
    await db.user.delete({ where: { id: user.id } })
  }
})

describe('POST /api/webhooks/stripe — fulfilment', () => {
  it('completes a first purchase and creates the account', async () => {
    const res = await deliver(completedSessionEvent(`cs_wh_a_${run}`, 'hl-maths'))
    expect(res.status).toBe(200)

    const user = await db.user.findUnique({ where: { email: EMAIL }, include: { purchases: true } })
    expect(user).not.toBeNull()
    expect(user!.purchases).toHaveLength(1)
    expect(user!.purchases[0]).toMatchObject({ courseId: 'hl-maths', status: 'COMPLETED' })
  })

  it('emails a one-click sign-in link backed by a valid Auth.js token', async () => {
    const { html } = send.mock.calls.at(-1)![0]
    const href = html.match(/href="([^"]*\/api\/auth\/callback\/resend[^"]*)"/)?.[1]
    expect(href).toBeDefined()

    const url = new URL(href!)
    expect(url.searchParams.get('email')).toBe(EMAIL)
    expect(url.searchParams.get('callbackUrl')).toBe('/dashboard')

    // Auth.js looks the token up as sha256(token + secret) — it must exist and be unexpired.
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
    const hashed = createHash('sha256').update(`${url.searchParams.get('token')}${secret}`).digest('hex')
    const row = await db.verificationToken.findUnique({ where: { token: hashed } })
    expect(row).toMatchObject({ identifier: EMAIL })
    expect(row!.expires.getTime()).toBeGreaterThan(Date.now())
  })

  it('lets the same account complete a purchase of a second, different course', async () => {
    const res = await deliver(completedSessionEvent(`cs_wh_b_${run}`, 'hl-chemistry'))
    expect(res.status).toBe(200)

    const user = await db.user.findUnique({ where: { email: EMAIL }, include: { purchases: true } })
    expect(user!.purchases.map((p) => p.courseId).sort()).toEqual(['hl-chemistry', 'hl-maths'])

    // Two distinct courses must not be flagged as duplicates.
    const flags = await db.auditLog.findMany({ where: { userId: user!.id, action: 'duplicate_purchase_detected' } })
    expect(flags).toHaveLength(0)
  })

  it('is idempotent when Stripe retries the same session', async () => {
    const res = await deliver(completedSessionEvent(`cs_wh_a_${run}`, 'hl-maths'))
    expect(res.status).toBe(200)

    const user = await db.user.findUnique({ where: { email: EMAIL }, include: { purchases: true } })
    expect(user!.purchases).toHaveLength(2)
  })

  it('records but flags a raced second payment for the same course', async () => {
    const res = await deliver(completedSessionEvent(`cs_wh_dup_${run}`, 'hl-maths'))
    expect(res.status).toBe(200)

    const user = await db.user.findUnique({ where: { email: EMAIL }, include: { purchases: true } })
    // The card was charged, so the record must exist for refunding…
    expect(user!.purchases).toHaveLength(3)
    // …and the audit log must flag it for the admin.
    const flags = await db.auditLog.findMany({ where: { userId: user!.id, action: 'duplicate_purchase_detected' } })
    expect(flags).toHaveLength(1)
  })

  it('rejects an invalid signature', async () => {
    constructEvent.mockImplementationOnce(() => { throw new Error('bad signature') })
    const res = await POST(webhookRequest())
    expect(res.status).toBe(400)
  })
})
