import { getShownAdIds } from '@/lib/ad-shown-tracker';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface CampaignItem {
  id: string;
  title: string;
  companyName: string;
  mediaType: string;
  mediaUrl: string;
  duration: number;
  description?: string;
  category?: string;
}

interface PublicAd {
  id: string;
  name: string;
  mediaType?: string;
  imageUrl?: string;
  duration?: number;
  content?: string;
  category?: string;
}

let lastFetchKey = '';
let lastFetchResult: CampaignItem[] | null = null;

export async function fetchActiveAds(gameId: string, restaurantId: string): Promise<CampaignItem[]> {
  const fetchKey = `${gameId}:${restaurantId}`;
  if (lastFetchKey === fetchKey && lastFetchResult) {
    const shownIds = getShownAdIds();
    const unseen = lastFetchResult.filter((ad) => !shownIds.includes(ad.id));
    return unseen.length > 0 ? unseen : lastFetchResult;
  }

  try {
    const params = new URLSearchParams();
    if (gameId) params.set('gameId', gameId);
    if (restaurantId) params.set('restaurantId', restaurantId);
    const url = `${API_BASE}/advertisements/public/active?${params}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];

    const data = (await res.json()) as { advertisements: PublicAd[] };
    const ads = (data.advertisements ?? []).map((ad) => ({
      id: ad.id,
      title: ad.name?.split(' — ')?.[0] ?? ad.name,
      companyName: ad.name?.split(' — ')?.[1] ?? '',
      mediaType: ad.mediaType ?? 'image',
      mediaUrl: ad.imageUrl ?? '',
      duration: (ad.duration ?? 15) * 1000,
      description: ad.content ?? undefined,
      category: ad.category ?? undefined,
    }));

    lastFetchKey = fetchKey;
    lastFetchResult = ads;

    const shownIds = getShownAdIds();
    const unseen = ads.filter((ad) => !shownIds.includes(ad.id));
    return unseen.length > 0 ? unseen : ads;
  } catch {
    return [];
  }
}

export function preloadMedia(campaigns: CampaignItem[]): void {
  for (const ad of campaigns) {
    if (!ad.mediaUrl) continue;
    if (ad.mediaType === 'video') {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = ad.mediaUrl;
      video.load();
    } else {
      const img = new Image();
      img.src = ad.mediaUrl;
    }
  }
}

export async function recordImpression(adId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/advertisements/${adId}/impression`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Silently fail
  }
}
