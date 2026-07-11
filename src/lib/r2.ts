import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!

export async function getContentSignedUrl(r2Key: string, type: 'video' | 'notes'): Promise<string> {
  const expiresIn = type === 'video' ? 7200 : 3600 // 2h video, 1h notes
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: r2Key })
  return getSignedUrl(r2, command, { expiresIn })
}

export async function getUploadSignedUrl(r2Key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: r2Key, ContentType: contentType })
  return getSignedUrl(r2, command, { expiresIn: 3600 })
}

export async function deleteContentObject(r2Key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: r2Key }))
}
