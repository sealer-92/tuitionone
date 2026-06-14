import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { slug, title, subject, year, description, priceEuros, weeks, schedule, status } = body

  if (!slug || !title || !subject || !year || priceEuros == null || weeks == null || !schedule) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await db.course.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'A course with that slug already exists' }, { status: 409 })

  const course = await db.course.create({
    data: {
      slug,
      title,
      subject,
      year,
      description: description || null,
      price: Math.round(Number(priceEuros) * 100),
      weeks: Number(weeks),
      schedule,
      status: status === 'ACTIVE' ? 'ACTIVE' : status === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT',
    },
  })

  return NextResponse.json({ id: course.id })
}
