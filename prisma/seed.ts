import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// Standard pricing (cents). Video courses offer all four options; booklet-only
// courses offer only the two booklet options.
const VIDEO = {
  format: "VIDEO_AND_BOOKLET" as const,
  fullPriceCents: 15000,
  fullPhysicalPriceCents: 20000,
  digitalBookletPriceCents: 3000,
  physicalBookletPriceCents: 5000,
};
const BOOKLET = {
  format: "BOOKLET_ONLY" as const,
  fullPriceCents: null,
  fullPhysicalPriceCents: null,
  digitalBookletPriceCents: 3000,
  physicalBookletPriceCents: 5000,
};

const courses = [
  { id: "hl-maths",     slug: "hl-maths",     title: "Higher Level Maths",     subject: "Maths",     year: "5th & 6th Year", weeks: 20, schedule: "Saturday 13:00–14:00", ...VIDEO },
  { id: "ol-maths",     slug: "ol-maths",     title: "Ordinary Level Maths",   subject: "Maths",     year: "5th & 6th Year", weeks: 14, schedule: "Saturday 09:00–10:00", ...VIDEO },
  { id: "hl-chemistry", slug: "hl-chemistry", title: "Higher Level Chemistry", subject: "Chemistry", year: "5th & 6th Year", weeks: 14, schedule: "Saturday 11:00–12:00", ...VIDEO },
  { id: "jc-maths",     slug: "jc-maths",     title: "Junior Cycle Maths",     subject: "Maths",     year: "3rd Year",       weeks: 14, schedule: "Saturday 12:00–13:00", ...VIDEO },
  { id: "hl-biology",   slug: "hl-biology",   title: "Higher Level Biology",   subject: "Biology",   year: "5th & 6th Year", weeks: 14, schedule: "Saturday 14:00–15:00", ...BOOKLET },
  { id: "jc-science",   slug: "jc-science",   title: "Junior Cycle Science",   subject: "Science",   year: "3rd Year",       weeks: 14, schedule: "Saturday 08:00–09:00", ...BOOKLET },
];

async function main() {
  for (const course of courses) {
    await db.course.upsert({
      where:  { id: course.id },
      update: { ...course, status: "ACTIVE" },
      create: { ...course, status: "ACTIVE" },
    });
  }
  console.log(`Seeded ${courses.length} courses.`);

  // Archive any pre-existing courses that aren't part of the new catalogue.
  const keepSlugs = courses.map((c) => c.slug);
  const archived = await db.course.updateMany({
    where: { slug: { notIn: keepSlugs }, status: { not: "ARCHIVED" } },
    data: { status: "ARCHIVED" },
  });
  if (archived.count > 0) console.log(`Archived ${archived.count} obsolete course(s).`);

  const adminEmail = "davidseale92@gmail.com";
  await db.user.upsert({
    where:  { email: adminEmail },
    update: { role: "ADMIN" },
    create: { email: adminEmail, name: "David Seale", role: "ADMIN" },
  });
  console.log(`Seeded admin user ${adminEmail}.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect());
