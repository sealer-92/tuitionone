-- Booklets become course-level content, separate from module videos.

CREATE TABLE "Booklet" (
    "id"        TEXT NOT NULL,
    "courseId"  TEXT NOT NULL,
    "order"     INTEGER NOT NULL,
    "title"     TEXT NOT NULL,
    "r2Key"     TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booklet_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Booklet_courseId_idx" ON "Booklet"("courseId");

ALTER TABLE "Booklet" ADD CONSTRAINT "Booklet_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Lift existing NOTES items up to their course. r2Key is carried over verbatim,
-- so nothing moves in R2 — migrated booklets keep their old module-scoped key.
INSERT INTO "Booklet" ("id", "courseId", "order", "title", "r2Key", "createdAt")
SELECT ci."id",
       m."courseId",
       ROW_NUMBER() OVER (PARTITION BY m."courseId" ORDER BY m."order", ci."createdAt"),
       ci."title",
       ci."r2Key",
       ci."createdAt"
FROM "ContentItem" ci
JOIN "Module" m ON m."id" = ci."moduleId"
WHERE ci."type" = 'NOTES';

DELETE FROM "ContentItem" WHERE "type" = 'NOTES';

-- ContentItem is now videos only.
ALTER TABLE "ContentItem" DROP COLUMN "type";
DROP TYPE "ContentType";
