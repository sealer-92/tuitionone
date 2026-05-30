import { NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeAuditLog } from '@/lib/access'

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const ip = (req as Request & { headers: Headers }).headers.get('x-forwarded-for') ?? 'unknown'

  // Soft delete — hard deletion runs via a scheduled job after 30 days
  await db.user.update({
    where: { id: session.user.id },
    data: { deletedAt: new Date() },
  })

  await writeAuditLog(session.user.id, 'deletion_requested', 'User', session.user.id, ip)

  await signOut()

  return NextResponse.json({ message: 'Deletion request received. Your account will be permanently deleted within 30 days.' })
}
