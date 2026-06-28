import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      purchases: { include: { course: { select: { title: true, subject: true } } } },
      consentLogs: true,
    },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const exportData = {
    exportedAt:  new Date().toISOString(),
    personalData: {
      email:     user.email,
      name:      user.name,
      phone:     user.phone,
      address:   [user.addressLine1, user.addressLine2, user.city, user.county, user.eircode].filter(Boolean).join(', ') || null,
      createdAt: user.createdAt,
      role:      user.role,
    },
    purchases: user.purchases.map((p) => ({
      course:      p.course.title,
      subject:     p.course.subject,
      studentName: p.studentName,
      amount:      `€${(p.amountCents / 100).toFixed(2)}`,
      status:      p.status,
      purchasedAt: p.createdAt,
    })),
    consentLog: user.consentLogs.map((c) => ({
      type:      c.type,
      version:   c.version,
      timestamp: c.timestamp,
    })),
  }

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': 'attachment; filename="tuition-one-data-export.json"',
      'Content-Type': 'application/json',
    },
  })
}
