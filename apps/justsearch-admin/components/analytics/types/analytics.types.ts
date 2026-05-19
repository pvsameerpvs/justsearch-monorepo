import type { RestaurantRevenue } from "@/lib/constants/revenue.constants";

export interface ComputedRestaurantRow extends RestaurantRevenue {
  userCount: number;
  points: number;
  area: string;
}

export interface GameStat {
  gameId: string;
  gameName: string;
  totalPoints: number;
  players: number;
}

export interface AdStat {
  id: string;
  title: string;
  companyName: string;
  type: "restaurant_brought" | "platform";
  impressions: number;
  completions: number;
  revenueJustsearch: number;
  revenueRestaurant: number;
  completionRate: number;
  isActive: boolean;
}
