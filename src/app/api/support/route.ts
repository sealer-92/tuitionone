import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendSupportTicketEmail } from '@/lib/email'
import { writeAuditLog } from '@/lib/access'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { subject, message } = await req.json()
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'A subject and message are required' }, { status: 400 })
  }

  const ticket = await db.supportTicket.create({
    data: {
      userId: session.user.id,
      subject: String(subject).slice(0, 200),
      message: String(message).slice(0, 5000),
    },
  })

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  await writeAuditLog(session.user.id, 'support_ticket_created', 'SupportTicket', ticket.id, ip)

  try {
    await sendSupportTicketEmail({
      subject: ticket.subject,
      message: ticket.message,
      fromEmail: session.user.email ?? 'unknown',
      fromName: session.user.name ?? null,
    })
  } catch (err) {
    // The ticket is saved; don't fail the request if the notification email bounces.
    console.error('Support ticket email failed:', err)
  }

  return NextResponse.json({ id: ticket.id })
}
