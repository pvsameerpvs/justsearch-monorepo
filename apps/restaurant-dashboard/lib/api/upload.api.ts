import { apiClient } from '@/lib/api-client';

export type UploadResponse = {
  url: string;
};

async function blobToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadImage(imageData: string, folder = 'general'): Promise<UploadResponse> {
  if (imageData.startsWith('blob:')) {
    const base64 = await blobToBase64(imageData);
    return apiClient<UploadResponse>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: base64, folder }),
    });
  }
  if (imageData.startsWith('data:')) {
    return apiClient<UploadResponse>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageData, folder }),
    });
  }
  return { url: imageData };
}
