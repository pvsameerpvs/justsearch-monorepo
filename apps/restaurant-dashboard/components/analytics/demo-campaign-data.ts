export interface DemoCampaign {
  id: string;
  companyName: string;
  title: string;
  clientName: string;
  mediaType: "image" | "video" | "gif";
  duration: number;
  assignedGames: number;
  impressions: number;
  skips: number;
  completions: number;
  revenue: number;
  isActive: boolean;
  type: "restaurant_brought" | "platform";
}

export const DEMO_CAMPAIGNS: DemoCampaign[] = [
  {
    id: "camp-001",
    companyName: "Desert Bloom Perfumes",
    title: "Summer Fragrance Collection",
    clientName: "Ahmed Al-Rashid",
    mediaType: "image",
    duration: 15,
    assignedGames: 2,
    impressions: 3420,
    skips: 890,
    completions: 2530,
    revenue: 12650,
    isActive: true,
    type: "restaurant_brought",
  },
  {
    id: "camp-002",
    companyName: "Golden Hour Watches",
    title: "Luxury Watch Flash Sale",
    clientName: "Fatima Hassan",
    mediaType: "gif",
    duration: 20,
    assignedGames: 1,
    impressions: 2150,
    skips: 520,
    completions: 1630,
    revenue: 8150,
    isActive: true,
    type: "restaurant_brought",
  },
  {
    id: "camp-003",
    companyName: "Coca-Cola Middle East",
    title: "Coca-Cola Summer Vibes",
    clientName: "Coca-Cola ME",
    mediaType: "image",
    duration: 10,
    assignedGames: 5,
    impressions: 12500,
    skips: 3100,
    completions: 9400,
    revenue: 47000,
    isActive: true,
    type: "platform",
  },
  {
    id: "camp-004",
    companyName: "Fitness First",
    title: "Dubai Fitness Challenge",
    clientName: "Fitness First UAE",
    mediaType: "video",
    duration: 18,
    assignedGames: 2,
    impressions: 8900,
    skips: 2400,
    completions: 6500,
    revenue: 32500,
    isActive: false,
    type: "platform",
  },
  {
    id: "camp-005",
    companyName: "Glow Naturally",
    title: "Organic Skincare Launch",
    clientName: "Priya Nair",
    mediaType: "video",
    duration: 12,
    assignedGames: 2,
    impressions: 1890,
    skips: 430,
    completions: 1460,
    revenue: 5840,
    isActive: true,
    type: "restaurant_brought",
  },
];
