export type AdCampaignType = 'restaurant_brought' | 'platform';
export type AdMediaType = 'image' | 'video' | 'gif';

export interface AdCampaign {
  id: string;
  title: string;
  clientName: string;
  companyName: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  mediaUrlLow: string | null;
  linkUrl: string | null;
  duration: number;
  type: AdCampaignType;
  restaurantId: string | null;
  restaurantName: string | null;
  assignedGames: string[];
  isActive: boolean;
  category: string | null;
  budget: number;
  costPerView3s: number;
  costPerViewFull: number;
  costPerClick: number;
  impressions: number;
  spent: number;
  totalViews3s: number;
  totalViewsFull: number;
  totalClicks: number;
  totalConfirmedClicks: number;
  totalAbandonedClicks: number;
  totalSkips: number;
  revenueJustsearch: number;
  revenueRestaurant: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  visibility: Record<string, boolean>;
}

export interface AdCampaignFormData {
  title: string;
  clientName: string;
  companyName: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  mediaUrlLow: string;
  linkUrl: string;
  duration: number;
  type: AdCampaignType;
  restaurantId: string | null;
  restaurantName: string | null;
  assignedGames: string[];
  isActive?: boolean;
  category: string;
  budget: number;
  costPerView3s: number;
  costPerViewFull: number;
  costPerClick: number;
  startDate: string;
  endDate: string;
  visibility: Record<string, boolean>;
}
