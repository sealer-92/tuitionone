import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const courses = [
  { id: "om-5",  slug: "om-5",  title: "Ordinary Level Maths",     subject: "Maths",     year: "5th Year",    weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 09:00–10:00" },
  { id: "om-6",  slug: "om-6",  title: "Ordinary Level Maths",     subject: "Maths",     year: "6th Year",    weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 10:00–11:00" },
  { id: "hc-6",  slug: "hc-6",  title: "Higher Level Chemistry",   subject: "Chemistry", year: "6th Year",    weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 11:00–12:00" },
  { id: "jcm",   slug: "jcm",   title: "Higher Level Maths",       subject: "Maths",     year: "Junior Cert", weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 12:00–13:00" },
  { id: "hm-5",  slug: "hm-5",  title: "Higher Level Maths",       subject: "Maths",     year: "5th Year",    weeks: 20, notesPrice: 5000, fullPrice: 55000, schedule: "Saturday 13:00–14:00" },
  { id: "hm-6",  slug: "hm-6",  title: "Higher Level Maths",       subject: "Maths",     year: "6th Year",    weeks: 20, notesPrice: 5000, fullPrice: 55000, schedule: "Saturday 14:00–15:00" },
  { id: "oc-6",  slug: "oc-6",  title: "Ordinary Level Chemistry", subject: "Chemistry", year: "6th Year",    weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 15:00–16:00" },
  { id: "jcs",   slug: "jcs",   title: "Junior Cycle Science",     subject: "Science",   year: "Junior Cert", weeks: 14, notesPrice: 5000, fullPrice: 45000, schedule: "Saturday 08:00–09:00" },
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
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect());
