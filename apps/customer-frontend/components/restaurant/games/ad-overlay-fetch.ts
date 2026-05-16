const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface CampaignItem {
  id: string;
  title: string;
  companyName: string;
  mediaType: string;
  mediaUrl: string;
  duration: number;
  description?: string;
}

interface PublicAd {
  id: string;
  name: string;
  mediaType?: string;
  imageUrl?: string;
  duration?: number;
  content?: string;
}

interface PublicAdResponse {
  advertisements: PublicAd[];
}

export async function fetchActiveAds(gameId: string, restaurantId: string): Promise<CampaignItem[]> {
  try {
    const params = new URLSearchParams();
    if (gameId) params.set('gameId', gameId);
    if (restaurantId) params.set('restaurantId', restaurantId);
    const res = await fetch(`${API_BASE}/advertisements/public/active?${params}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as PublicAdResponse;
    return data.advertisements.map((ad) => ({
      id: ad.id,
      title: ad.name?.split(' — ')?.[0] ?? ad.name,
      companyName: ad.name?.split(' — ')?.[1] ?? '',
      mediaType: ad.mediaType ?? 'image',
      mediaUrl: ad.imageUrl ?? '🍽️',
      duration: (ad.duration ?? 15) * 1000,
      description: ad.content ?? undefined,
    }));
  } catch {
    return [];
  }
}

export const FALLBACK_AD: CampaignItem = {
  id: 'fb-1', title: 'Special Offer', description: 'Get 20% off!',
  mediaUrl: '🍽️', mediaType: 'image', duration: 5000, companyName: 'Restaurant',
};
