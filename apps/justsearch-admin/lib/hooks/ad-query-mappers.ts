import type { AdCampaign } from '@/lib/stores/ad-campaign-types';

export interface DbAd {
  id: string;
  name: string;
  type: string;
  mediaType: string;
  content: string | null;
  imageUrl: string | null;
  duration: number;
  category: string | null;
  budget: string | null;
  costPerImpression: string | null;
  impressions: number;
  spent: string | null;
  assignedGames: string[];
  targetRestaurants: string[];
  isActive: boolean;
  createdAt: string;
}

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
    category: db.category ?? null,
    budget: Number(db.budget ?? 0),
    costPerImpression: Number(db.costPerImpression ?? 0),
    impressions: db.impressions ?? 0,
    spent: Number(db.spent ?? 0),
    revenue: 0,
    createdAt: db.createdAt,
  };
}

export function mapCampaignToDb(data: {
  title: string;
  clientName: string;
  companyName: string;
  mediaType: string;
  mediaUrl: string;
  duration: number;
  type: string;
  restaurantId: string | null;
  assignedGames: string[];
  isActive?: boolean;
  category: string;
  budget: number;
  costPerImpression: number;
}) {
  return {
    name: `${data.title} — ${data.companyName}`,
    type: data.type,
    mediaType: data.mediaType,
    content: data.clientName,
    imageUrl: data.mediaUrl,
    duration: data.duration,
    category: data.category || null,
    budget: String(data.budget),
    costPerImpression: String(data.costPerImpression),
    assignedGames: data.assignedGames,
    targetRestaurants: data.restaurantId ? [data.restaurantId] : [],
    isActive: data.isActive ?? true,
  };
}
