-- Single-tier refactor: one purchase grants access to all of a course's content.

-- Course: replace dual pricing with a single price.
ALTER TABLE "Course" DROP COLUMN "notesPrice";
ALTER TABLE "Course" DROP COLUMN "fullPrice";
ALTER TABLE "Course" ADD COLUMN "price" INTEGER NOT NULL;

-- Purchase: drop the tier; a completed purchase grants full access.
ALTER TABLE "Purchase" DROP COLUMN "tier";

-- ContentItem: drop the per-item access tier.
ALTER TABLE "ContentItem" DROP COLUMN "accessTier";

-- Remove the now-unused enum.
DROP TYPE "AccessTier";
