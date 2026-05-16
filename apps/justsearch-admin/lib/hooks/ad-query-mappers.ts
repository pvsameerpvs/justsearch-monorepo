import type { AdCampaign, AdCampaignFormData, AdCampaignType, AdMediaType } from '@/lib/stores/ad-campaign-types';

export type DbAd = {
  id: string;
  name: string;
  type: AdCampaignType;
  mediaType: AdMediaType;
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
    mediaType: db.mediaType,
    mediaUrl: db.imageUrl ?? '',
    duration: db.duration ?? 15,
    type: db.type,
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

export function mapPartialFormToDb(data: Partial<AdCampaignFormData>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  if (data.title !== undefined || data.companyName !== undefined) {
    mapped.name = `${data.title ?? ''} — ${data.companyName ?? ''}`;
  }
  if (data.type !== undefined) mapped.type = data.type;
  if (data.mediaType !== undefined) mapped.mediaType = data.mediaType;
  if (data.clientName !== undefined) mapped.content = data.clientName;
  if (data.mediaUrl !== undefined) mapped.imageUrl = data.mediaUrl;
  if (data.duration !== undefined) mapped.duration = data.duration;
  if (data.assignedGames !== undefined) mapped.assignedGames = data.assignedGames;
  if (data.restaurantId !== undefined) mapped.targetRestaurants = data.restaurantId ? [data.restaurantId] : [];
  if (data.isActive !== undefined) mapped.isActive = data.isActive;
  return mapped;
}
