import { apiClient } from '@/lib/api-client';

export type UploadResponse = {
  url: string;
};

export async function uploadImage(imageBase64: string, folder = 'general'): Promise<string> {
  if (!imageBase64.startsWith('data:') && !imageBase64.startsWith('http')) {
    throw new Error('Invalid image data');
  }

  // Pass through external URLs without uploading
  if (imageBase64.startsWith('http')) {
    return imageBase64;
  }

  const { url } = await apiClient<UploadResponse>('/upload', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64, folder }),
  });

  return url;
}
