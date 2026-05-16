import { v4 as uuid } from 'uuid';
import { supabase } from '../../lib/supabase';

const BUCKET_NAME = 'uploads';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/jpeg': 'jpg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
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

export async function saveImage(dataUrl: string, folder: string): Promise<string> {
  const base64Data = dataUrl.replace(/^data:[a-z]+\/[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = getExtension(dataUrl);
  const mimeType = getMimeType(dataUrl);
  const filename = `${folder}/${uuid()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
  return data.publicUrl;
}
