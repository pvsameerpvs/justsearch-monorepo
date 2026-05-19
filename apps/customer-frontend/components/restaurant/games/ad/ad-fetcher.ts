import { getShownAdIds } from '@/lib/ad-shown-tracker';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('justsearch:authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('JustSearch FP', 2, 2);
    const canvasHash = canvas.toDataURL().slice(-16);
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const userAgent = navigator.userAgent.slice(-16);
    return btoa(`${canvasHash}-${screenInfo}-${userAgent}`).slice(0, 64);
  } catch {
    return '';
  }
}

export interface CampaignItem {
  id: string;
  title: string;
  mediaType: string;
  mediaUrl: string;
  mediaUrlLow: string;
  linkUrl: string;
  duration: number;
  description?: string;
  category?: string;
  visibility: Record<string, boolean>;
}

interface PublicAd {
  id: string;
  name: string;
  mediaType?: string;
  imageUrl?: string;
  mediaUrlLow?: string;
  linkUrl?: string;
  duration?: number;
  content?: string;
  category?: string;
  visibility?: Record<string, boolean>;
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
      title: ad.name?.split(' — ')?.[0] ?? ad.name ?? '',
      mediaType: ad.mediaType ?? 'image',
      mediaUrl: ad.imageUrl ?? '',
      mediaUrlLow: ad.mediaUrlLow ?? '',
      linkUrl: ad.linkUrl ?? '',
      duration: (ad.duration ?? 15) * 1000,
      description: ad.content ?? undefined,
      category: ad.category ?? undefined,
      visibility: ad.visibility ?? { title: true, description: false, linkUrl: true },
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

// Track ad event: view_3s, view_full, click_pending, skip. Returns eventId for click tracking.
export async function trackAdEvent(
  adId: string,
  eventType: 'view_3s' | 'view_full' | 'click_pending' | 'skip'
): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/advertisements/public/${adId}/event`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ eventType, deviceFingerprint: getDeviceFingerprint() }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { eventId?: string };
    return data.eventId ?? null;
  } catch {
    return null;
  }
}

// Confirm a click after user stayed on linked page > 3 seconds
export async function confirmAdClick(adId: string, eventId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/advertisements/public/${adId}/click-confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ eventId }),
    });
  } catch {
    // Silently fail
  }
}

// Mark click as accidental (user bounced quickly)
export async function abandonAdClick(adId: string, eventId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/advertisements/public/${adId}/click-abandon`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ eventId }),
    });
  } catch {
    // Silently fail
  }
}
