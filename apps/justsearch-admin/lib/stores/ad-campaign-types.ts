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
  assignedGames: string[];
  isActive: boolean;
  category: string | null;
  budget: number;
  costPerImpression: number;
  impressions: number;
  spent: number;
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
  isActive?: boolean;
  category: string;
  budget: number;
  costPerImpression: number;
}
