import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;

const pdfBytes = readFileSync("test-assets/sample.pdf");
const mp4Bytes = readFileSync("test-assets/sample.mp4");

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);

async function upload(key: string, body: Buffer, contentType: string) {
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
  return key;
}

// Two modules per course; each module gets one PDF + one video.
const targetCourses = ["hl-maths", "hl-chemistry"];
const modulesPerCourse = [
  { title: "Module 1 — Foundations" },
  { title: "Module 2 — Core Techniques" },
];

async function seedCourse(courseId: string) {
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) { console.log(`Course ${courseId} not found, skipping.`); return; }

  // Idempotent: clear any existing modules (cascades to content items) before reseeding.
  await db.module.deleteMany({ where: { courseId } });

  for (let i = 0; i < modulesPerCourse.length; i++) {
    const order = i + 1;
    const mod = await db.module.create({
      data: { courseId, order, title: modulesPerCourse[i].title },
    });

    const modulePart = `module-${String(order).padStart(2, "0")}-${slugify(modulesPerCourse[i].title)}`;
    const prefix = `courses/${course.slug}/${modulePart}`;

    const notesKey = await upload(`${prefix}/notes/sample.pdf`, pdfBytes, "application/pdf");
    await db.contentItem.create({
      data: { moduleId: mod.id, type: "NOTES", title: `${modulesPerCourse[i].title} — Notes`, r2Key: notesKey },
    });

    const videoKey = await upload(`${prefix}/videos/sample.mp4`, mp4Bytes, "video/mp4");
    await db.contentItem.create({
      data: { moduleId: mod.id, type: "VIDEO", title: `${modulesPerCourse[i].title} — Lesson`, r2Key: videoKey, durationSeconds: 10 },
    });
  }
  console.log(`Seeded content for ${courseId}: ${modulesPerCourse.length} modules with notes + video.`);
}

async function main() {
  for (const id of targetCourses) await seedCourse(id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
