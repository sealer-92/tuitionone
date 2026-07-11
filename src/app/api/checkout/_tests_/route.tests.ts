import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'

// Stripe and the Redis rate limiter are external services — stub them so the
// test exercises our own checkout logic against the real (local) database.
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        create: vi.fn(async () => ({ id: `cs_test_${Math.random().toString(36).slice(2)}`, url: 'https://checkout.stripe.test/session' })),
      },
    },
  }),
}))
vi.mock('@/lib/ratelimit', () => ({
  checkoutRateLimit: { limit: vi.fn(async () => ({ success: true })) },
  signInRateLimit: { limit: vi.fn(async () => ({ success: true })) },
}))

import { POST } from '@/app/api/checkout/route'
import { db } from '@/lib/db'

const run = Math.random().toString(36).slice(2, 8)
const OWNER_EMAIL = `owner.${run}@tests.example.com`
const FRESH_EMAIL = `fresh.${run}@tests.example.com`

function checkoutRequest(overrides: Record<string, unknown> = {}) {
  return new NextRequest('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      courseId: 'hl-maths',
      option: 'FULL',
      parentName: 'Test Parent',
      parentEmail: OWNER_EMAIL,
      parentPhone: '0870000000',
      studentName: 'Test Student',
      line1: '1 Main Street',
      city: 'Carlow',
      county: 'Carlow',
      eircode: 'R93A1B2',
      ...overrides,
    }),
  })
}

beforeAll(async () => {
  // OWNER_EMAIL already owns hl-maths.
  const user = await db.user.create({ data: { email: OWNER_EMAIL, name: 'Test Parent', role: 'STUDENT' } })
  await db.purchase.create({
    data: {
      userId: user.id,
      courseId: 'hl-maths',
      option: 'FULL',
      stripeSessionId: `test-owned-${run}`,
      amountCents: 15000,
      currency: 'eur',
      status: 'COMPLETED',
    },
  })
})

afterAll(async () => {
  await db.purchase.deleteMany({ where: { user: { email: { endsWith: `${run}@tests.example.com` } } } })
  await db.user.deleteMany({ where: { email: { endsWith: `${run}@tests.example.com` } } })
})

describe('POST /api/checkout — duplicate purchase prevention', () => {
  it('rejects buying a course the email already owns', async () => {
    const res = await POST(checkoutRequest())
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toMatch(/already been purchased/i)
  })

  it('rejects regardless of email casing', async () => {
    const res = await POST(checkoutRequest({ parentEmail: OWNER_EMAIL.toUpperCase() }))
    expect(res.status).toBe(409)
  })

  it('rejects even when a different option of the same course is chosen', async () => {
    const res = await POST(checkoutRequest({ option: 'DIGITAL_BOOKLET' }))
    expect(res.status).toBe(409)
  })

  it('allows the same email to buy a different course', async () => {
    const res = await POST(checkoutRequest({ courseId: 'hl-chemistry' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.url).toContain('https://checkout.stripe.test')
  })

  it('allows a new email to buy a course someone else owns', async () => {
    const res = await POST(checkoutRequest({ parentEmail: FRESH_EMAIL }))
    expect(res.status).toBe(200)
  })

  it('does not treat a REFUNDED purchase as ownership', async () => {
    const user = await db.user.create({ data: { email: `refunded.${run}@tests.example.com`, role: 'STUDENT' } })
    await db.purchase.create({
      data: {
        userId: user.id,
        courseId: 'hl-maths',
        option: 'FULL',
        stripeSessionId: `test-refunded-${run}`,
        amountCents: 15000,
        currency: 'eur',
        status: 'REFUNDED',
      },
    })
    const res = await POST(checkoutRequest({ parentEmail: `refunded.${run}@tests.example.com` }))
    expect(res.status).toBe(200)
  })
})

describe('POST /api/checkout — input validation', () => {
  it('rejects a missing email', async () => {
    const res = await POST(checkoutRequest({ parentEmail: undefined }))
    expect(res.status).toBe(400)
  })

  it('rejects a malformed email', async () => {
    const res = await POST(checkoutRequest({ parentEmail: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('rejects a missing course or option', async () => {
    expect((await POST(checkoutRequest({ courseId: undefined }))).status).toBe(400)
    expect((await POST(checkoutRequest({ option: undefined }))).status).toBe(400)
  })

  it('rejects an invalid eircode', async () => {
    const res = await POST(checkoutRequest({ eircode: 'BAD' }))
    expect(res.status).toBe(400)
  })

  it('404s for an unknown course', async () => {
    const res = await POST(checkoutRequest({ courseId: 'no-such-course', parentEmail: FRESH_EMAIL }))
    expect(res.status).toBe(404)
  })

  it('rejects an option the course does not offer', async () => {
    // hl-biology is booklet-only, so FULL is never purchasable.
    const res = await POST(checkoutRequest({ courseId: 'hl-biology', option: 'FULL', parentEmail: FRESH_EMAIL }))
    expect(res.status).toBe(400)
  })
})
