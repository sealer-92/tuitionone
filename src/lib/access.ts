import { Prisma } from '@prisma/client'
import { db } from './db'

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

  const purchase = await db.purchase.findFirst({
    where: { userId, courseId: item.module.courseId, status: 'COMPLETED' },
  })

  if (!purchase) {
    await writeAuditLog(userId, 'content_access_denied', 'ContentItem', itemId, ipAddress)
    return false
  }

  const allowed = purchase.tier === 'FULL' || item.accessTier === 'NOTES_ONLY'

  await writeAuditLog(
    userId,
    allowed ? 'content_access' : 'content_access_denied',
    'ContentItem',
    itemId,
    ipAddress,
    { tier: purchase.tier, itemAccessTier: item.accessTier } as Prisma.InputJsonValue,
  )

  return allowed
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
