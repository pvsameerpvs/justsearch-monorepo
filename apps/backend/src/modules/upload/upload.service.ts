import { v4 as uuid } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../../lib/r2';

// ── Allowed R2 folder structure ────────────────────────
export const ALLOWED_FOLDERS = [
  'menu',        // Menu item photos
  'logos',       // Restaurant logos
  'banners',     // Hero / banner images
  'ads',         // Advertisement images & videos
  'restaurants', // Restaurant gallery / interior / other photos
  'games',       // Game poster / preview images
  'qr',          // QR codes (PNG)
  'pdfs',        // PDF menus, invoices, documents
  'general',     // Fallback for anything else
] as const;

export type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/jpeg': 'jpg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'application/pdf': 'pdf',
};

function getExtension(dataUrl: string): string {
  for (const [mime, ext] of Object.entries(MIME_EXTENSIONS)) {
    if (dataUrl.includes(mime)) return ext;
  }
  return 'jpg';
}

function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(/^data:([^;]+);base64,/);
  return match?.[1] ?? 'application/octet-stream';
}

export function sanitizeFolder(input: string): AllowedFolder {
  const clean = input.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  if (ALLOWED_FOLDERS.includes(clean as AllowedFolder)) {
    return clean as AllowedFolder;
  }
  return 'general';
}

export async function saveImage(
  dataUrl: string,
  folder: AllowedFolder
): Promise<string> {
  const safeFolder = sanitizeFolder(folder);
  const base64Data = dataUrl.replace(/^data:[a-z]+\/[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = getExtension(dataUrl);
  const mimeType = getMimeType(dataUrl);
  const filename = `${safeFolder}/${uuid()}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${filename}` : filename;
  return publicUrl;
}
