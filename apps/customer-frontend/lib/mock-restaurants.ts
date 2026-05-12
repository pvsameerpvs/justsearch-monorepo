// Re-export from shared packages for backward compatibility
export {
  mockRestaurants,
  getRestaurantBySlug,
  getAllRestaurantSlugs,
  getRestaurantInitials,
  getRestaurantDomain,
  getRestaurantMenuDomain,
  getRestaurantDashboardDomain,
  getDeliveryPortalDomain,
} from '@justsearch/utils';

export type { Restaurant } from '@justsearch/utils';
