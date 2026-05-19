import type { AdCampaign, AdCampaignFormData } from '@/lib/stores/ad-campaign-types';

export interface DbAd {
  id: string;
  name: string;
  type: string;
  mediaType: string;
  content: string | null;
  imageUrl: string | null;
  mediaUrlLow: string | null;
  linkUrl: string | null;
  duration: number;
  category: string | null;
  budget: string | null;
  costPerImpression: string | null;
  costPerView3s: string | null;
  costPerViewFull: string | null;
  costPerClick: string | null;
  impressions: number;
  spent: string | null;
  assignedGames: string[];
  targetRestaurants: string[];
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  visibility: Record<string, boolean> | null;
  totalViews3s: number | null;
  totalViewsFull: number | null;
  totalClicks: number | null;
  totalConfirmedClicks: number | null;
  totalAbandonedClicks: number | null;
  revenueJustsearch: string | null;
  revenueRestaurant: string | null;
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
    mediaUrlLow: db.mediaUrlLow ?? null,
    linkUrl: db.linkUrl ?? null,
    duration: db.duration ?? 15,
    type: db.type as 'restaurant_brought' | 'platform',
    restaurantId: db.targetRestaurants?.[0] ?? null,
    restaurantName: null,
    assignedGames: db.assignedGames ?? [],
    isActive: db.isActive,
    category: db.category ?? null,
    budget: Number(db.budget ?? 0),
    costPerImpression: Number(db.costPerImpression ?? 0),
    costPerView3s: Number(db.costPerView3s ?? 0.30),
    costPerViewFull: Number(db.costPerViewFull ?? 1.00),
    costPerClick: Number(db.costPerClick ?? 5.00),
    impressions: db.impressions ?? 0,
    spent: Number(db.spent ?? 0),
    totalViews3s: db.totalViews3s ?? 0,
    totalViewsFull: db.totalViewsFull ?? 0,
    totalClicks: db.totalClicks ?? 0,
    totalConfirmedClicks: db.totalConfirmedClicks ?? 0,
    totalAbandonedClicks: db.totalAbandonedClicks ?? 0,
    revenueJustsearch: Number(db.revenueJustsearch ?? 0),
    revenueRestaurant: Number(db.revenueRestaurant ?? 0),
    startDate: db.startDate ?? null,
    endDate: db.endDate ?? null,
    createdAt: db.createdAt,
    visibility: db.visibility ?? { title: true, description: false, linkUrl: true },
  };
}

export function mapCampaignToDb(data: AdCampaignFormData) {
  return {
    name: `${data.title} — ${data.companyName}`,
    type: data.type,
    mediaType: data.mediaType,
    content: data.clientName,
    imageUrl: data.mediaUrl,
    mediaUrlLow: data.mediaUrlLow || undefined,
    linkUrl: data.linkUrl || undefined,
    duration: data.duration,
    category: data.category || null,
    budget: String(data.budget),
    costPerView3s: String(data.costPerView3s ?? 0.30),
    costPerViewFull: String(data.costPerViewFull ?? 1.00),
    costPerClick: String(data.costPerClick ?? 5.00),
    assignedGames: data.assignedGames,
    targetRestaurants: data.restaurantId ? [data.restaurantId] : [],
    isActive: data.isActive ?? true,
    startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
    endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    visibility: data.visibility ?? { title: true, description: false, linkUrl: true },
  };
}
