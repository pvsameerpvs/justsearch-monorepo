import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { v4 as uuid } from 'uuid';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/jpeg': 'jpg',
  'application/pdf': 'pdf',
};

function getExtension(dataUrl: string): string {
  for (const [mime, ext] of Object.entries(MIME_EXTENSIONS)) {
    if (dataUrl.includes(mime)) return ext;
  }
  return 'jpg';
}

export async function saveImage(dataUrl: string, folder: string): Promise<string> {
  const base64Data = dataUrl.replace(/^data:[a-z]+\/[\w+.-]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = getExtension(dataUrl);
  const filename = `${uuid()}.${ext}`;
  const folderPath = join(UPLOADS_DIR, folder);

  await mkdir(folderPath, { recursive: true });
  await writeFile(join(folderPath, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}
