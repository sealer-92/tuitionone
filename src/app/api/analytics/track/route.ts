import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pageViewRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await pageViewRateLimit.limit(ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { path, referrer, sessionId } = await req.json()
  if (typeof path !== 'string' || !path || typeof sessionId !== 'string' || !sessionId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const session = await auth()

  await db.pageView.create({
    data: {
      path: path.slice(0, 500),
      referrer: typeof referrer === 'string' && referrer ? referrer.slice(0, 500) : null,
      sessionId: sessionId.slice(0, 100),
      userId: session?.user?.id ?? null,
    },
  })

  return NextResponse.json({ ok: true })
}
