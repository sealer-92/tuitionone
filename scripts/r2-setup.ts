import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { S3Client, CreateBucketCommand, PutBucketCorsCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;
const origins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://tuitionone-git-master-david-seale-s-projects.vercel.app",
  "https://*.vercel.app",
];

async function main() {
  // Create the bucket (ignore if it already exists).
  try {
    await r2.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" already exists.`);
  } catch {
    await r2.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log(`Created bucket "${BUCKET}".`);
  }

  // Allow the dev origin to PUT (admin uploads) and GET/HEAD (signed playback).
  await r2.send(new PutBucketCorsCommand({
    Bucket: BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: origins,
          AllowedMethods: ["GET", "PUT", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }));
  console.log(`Set CORS on "${BUCKET}" for: ${origins.join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
