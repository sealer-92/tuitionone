-- Initial launch scope: only Higher/Ordinary Level Maths and Junior Cycle
-- (Higher Level) Maths are available for purchase. Higher Level Chemistry,
-- Higher Level Biology and Junior Cycle Science are kept in the catalogue
-- for a later release, shown on the site as "coming soon".
UPDATE "Course" SET "status" = 'COMING_SOON'
WHERE "slug" IN ('hl-chemistry', 'hl-biology', 'jc-science');

-- Digital booklets aren't ready yet — remove that purchase option (and its
-- price) from the courses on sale now. The column/data model is kept so it
-- can be re-priced and re-enabled later without a schema change.
UPDATE "Course" SET "digitalBookletPriceCents" = NULL, "physicalBookletPriceCents" = NULL
WHERE "slug" IN ('hl-maths', 'ol-maths', 'jc-maths');

-- Clarify the level now that this is the only Junior Cycle Maths course on
-- offer (an Ordinary Level Junior Cycle course may be added later).
UPDATE "Course" SET "title" = 'Junior Cycle Maths (Higher Level)'
WHERE "slug" = 'jc-maths';
