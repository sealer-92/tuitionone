import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const STUDENT_EMAIL = "student.test@example.com";
const COURSE_IDS = ["hl-maths", "hl-chemistry"];

async function main() {
  const user = await db.user.upsert({
    where: { email: STUDENT_EMAIL },
    update: { role: "STUDENT" },
    create: { email: STUDENT_EMAIL, name: "Test Student", role: "STUDENT" },
  });

  for (const courseId of COURSE_IDS) {
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) { console.log(`Course ${courseId} not found, skipping.`); continue; }
    await db.purchase.upsert({
      where: { stripeSessionId: `seed-test-${courseId}` },
      update: { status: "COMPLETED" },
      create: {
        userId: user.id,
        courseId,
        option: "FULL",
        stripeSessionId: `seed-test-${courseId}`,
        amountCents: course.fullPriceCents ?? course.digitalBookletPriceCents ?? 0,
        currency: "eur",
        status: "COMPLETED",
      },
    });
  }
  console.log(`Seeded test student ${STUDENT_EMAIL} with ${COURSE_IDS.length} completed purchases.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
