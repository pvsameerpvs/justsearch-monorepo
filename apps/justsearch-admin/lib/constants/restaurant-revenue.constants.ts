import type { RestaurantRevenue } from './revenue.constants';

export const RESTAURANT_REVENUE_DATA: RestaurantRevenue[] = [
  { id: '1', name: 'Mosaic Table', city: 'Dubai', status: 'active', orders: 342, views: 12400, adRevenue: 20800, subscriptionRevenue: 4500, platformFee: 3200 },
  { id: '2', name: 'Spice Garden', city: 'Dubai', status: 'active', orders: 186, views: 6800, adRevenue: 8200, subscriptionRevenue: 2900, platformFee: 1640 },
  { id: '3', name: 'Spice Route', city: 'Dubai', status: 'active', orders: 154, views: 5200, adRevenue: 5840, subscriptionRevenue: 2900, platformFee: 1340 },
  { id: '4', name: 'Desert Bloom', city: 'Abu Dhabi', status: 'active', orders: 98, views: 3100, adRevenue: 4200, subscriptionRevenue: 2200, platformFee: 880 },
  { id: '5', name: 'Golden Hour', city: 'Dubai', status: 'draft', orders: 0, views: 0, adRevenue: 0, subscriptionRevenue: 0, platformFee: 0 },
  { id: '6', name: 'Glow Naturally', city: 'Sharjah', status: 'active', orders: 67, views: 2400, adRevenue: 3100, subscriptionRevenue: 1800, platformFee: 620 },
];
