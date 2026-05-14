export type RestaurantRevenue = {
  id: string;
  name: string;
  city: string;
  status: 'active' | 'draft' | 'suspended';
  orders: number;
  views: number;
  adRevenue: number;
  subscriptionRevenue: number;
  platformFee: number;
};

export const AD_SPLIT_RESTAURANT_BROUGHT = { restaurant: 60, platform: 40 };
export const AD_SPLIT_PLATFORM_BROUGHT = { platform: 60, restaurant: 40 };

export const MONTHLY_TREND = [32000, 34500, 31000, 38000, 42000, 45000];
