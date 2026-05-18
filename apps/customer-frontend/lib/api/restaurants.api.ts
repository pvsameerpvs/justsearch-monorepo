import { apiClient } from './client';

export type ApiRestaurantData = {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  theme: Record<string, string>;
  settings: Record<string, unknown>;
};

export async function fetchCurrentRestaurant(host: string): Promise<ApiRestaurantData | null> {
  try {
    return await apiClient<ApiRestaurantData>('/restaurants/current', {
      tenantHost: host,
    });
  } catch {
    return null;
  }
}
