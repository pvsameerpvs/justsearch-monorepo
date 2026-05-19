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
