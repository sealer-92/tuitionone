import { Prisma, PurchaseOption } from '@prisma/client'
import { db } from './db'
import { grantsBooklet, grantsVideo } from './options'

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

  return checkAccess(userId, item.module.courseId, grantsVideo, 'ContentItem', itemId, ipAddress)
}

export async function canAccessBooklet(
  userId: string,
  bookletId: string,
  ipAddress: string,
): Promise<boolean> {
  const booklet = await db.booklet.findUnique({
    where: { id: bookletId },
    select: { courseId: true },
  })

  if (!booklet) return false

  return checkAccess(userId, booklet.courseId, grantsBooklet, 'Booklet', bookletId, ipAddress)
}

// A user may hold more than one completed purchase for a course; grant by the
// most permissive option they own.
async function checkAccess(
  userId: string,
  courseId: string,
  grants: (option: PurchaseOption) => boolean,
  resourceType: string,
  resourceId: string,
  ipAddress: string,
): Promise<boolean> {
  const purchases = await db.purchase.findMany({
    where: { userId, courseId, status: 'COMPLETED' },
    select: { option: true },
  })

  const allowed = purchases.some((p) => grants(p.option))

  await writeAuditLog(
    userId,
    allowed ? 'content_access' : 'content_access_denied',
    resourceType,
    resourceId,
    ipAddress,
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
