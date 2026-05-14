export type AdCampaignType = 'restaurant_brought' | 'platform';
export type AdMediaType = 'image' | 'video' | 'gif';

export interface AdCampaign {
  id: string;
  title: string;
  clientName: string;
  companyName: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  duration: number;
  type: AdCampaignType;
  restaurantId: string | null;
  restaurantName: string | null;
  assignedGames: string[]; // game IDs this ad runs on
  isActive: boolean;
  impressions: number;
  skips: number;
  completions: number;
  revenue: number;
  createdAt: string;
}

export interface AdCampaignFormData {
  title: string;
  clientName: string;
  companyName: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  duration: number;
  type: AdCampaignType;
  restaurantId: string | null;
  restaurantName: string | null;
  assignedGames: string[];
}

export interface AdCampaignStats {
  total: number;
  active: number;
  restaurantBrought: number;
  platform: number;
  totalRevenue: number;
  totalImpressions: number;
  totalCompletions: number;
}
