import { Prisma } from '@prisma/client'
import { db } from './db'
import { grantsNotes, grantsVideo } from './options'

export async function canAccessItem(
  userId: string,
  itemId: string,
  ipAddress: string,
): Promise<boolean> {
  const item = await db.contentItem.findUnique({
    where: { id: itemId },
    include: { module: { select: { courseId: true } } },
  })

  if (!item) return false

  // A user may hold more than one completed purchase for a course; grant by the
  // most permissive option they own.
  const purchases = await db.purchase.findMany({
    where: { userId, courseId: item.module.courseId, status: 'COMPLETED' },
    select: { option: true },
  })

  const allowed =
    item.type === 'VIDEO'
      ? purchases.some((p) => grantsVideo(p.option))
      : purchases.some((p) => grantsNotes(p.option))

  if (!allowed) {
    await writeAuditLog(userId, 'content_access_denied', 'ContentItem', itemId, ipAddress)
    return false
  }

  await writeAuditLog(userId, 'content_access', 'ContentItem', itemId, ipAddress)

  return true
}

export async function writeAuditLog(
  userId: string | null,
  action: string,
  resourceType: string | null,
  resourceId: string | null,
  ipAddress: string,
  metadata?: Prisma.InputJsonValue,
) {
  await db.auditLog.create({
    data: {
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      metadata: metadata ?? Prisma.JsonNull,
    },
  })
}
