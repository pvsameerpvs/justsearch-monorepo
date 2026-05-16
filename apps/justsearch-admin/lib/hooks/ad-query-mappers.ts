import type { AdCampaign, AdCampaignFormData } from '@/lib/stores/ad-campaign-types';

export type DbAd = {
  id: string;
  name: string;
  type: string;
  mediaType: string;
  content: string | null;
  imageUrl: string | null;
  duration: number;
  assignedGames: string[];
  targetRestaurants: string[];
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

export function mapDbToCampaign(db: DbAd): AdCampaign {
  const nameParts = db.name.split(' — ');
  return {
    id: db.id,
    title: nameParts[0] || db.name,
    clientName: db.content ?? '',
    companyName: nameParts[1] || '',
    mediaType: db.mediaType as 'image' | 'video' | 'gif',
    mediaUrl: db.imageUrl ?? '',
    duration: db.duration ?? 15,
    type: db.type as 'restaurant_brought' | 'platform',
    restaurantId: db.targetRestaurants?.[0] ?? null,
    restaurantName: null,
    assignedGames: db.assignedGames ?? [],
    isActive: db.isActive,
    impressions: 0,
    skips: 0,
    completions: 0,
    revenue: 0,
    createdAt: db.createdAt,
  };
}

export function mapFormToDb(data: AdCampaignFormData) {
  return {
    name: `${data.title} — ${data.companyName}`,
    type: data.type,
    mediaType: data.mediaType,
    content: data.clientName,
    imageUrl: data.mediaUrl,
    duration: data.duration,
    assignedGames: data.assignedGames,
    targetRestaurants: data.restaurantId ? [data.restaurantId] : [],
    isActive: data.isActive ?? true,
  };
}
