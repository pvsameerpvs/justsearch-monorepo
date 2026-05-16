import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 30_000;

export interface RestaurantProfile {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  theme: Record<string, string>;
  heroImageUrl?: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  category: string;
  cuisine: string[];
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  overallRating: number;
  totalReviews: number;
  openingHours: Array<{ day: string; hours: string; isToday?: boolean }>;
  socials: Array<{ platform: string; url: string; handle: string }>;
  menu: unknown[];
  games: unknown[];
  reviews: unknown[];
  partyPackages: unknown[];
}

async function fetchCurrentRestaurant(): Promise<RestaurantProfile> {
  const data = await apiClient<{
    id: string;
    slug: string;
    subdomain: string;
    name: string;
    status: string;
    theme: Record<string, string>;
    settings: Record<string, unknown>;
  }>('/restaurants/current');

  const s = data.settings || {};

  return {
    id: data.id,
    slug: data.slug,
    subdomain: data.subdomain,
    name: data.name,
    status: data.status,
    theme: data.theme || {},
    heroImageUrl: (s.heroImageUrl as string) || undefined,
    logoUrl: (s.logoUrl as string) || undefined,
    tagline: (s.tagline as string) || '',
    description: (s.description as string) || '',
    category: (s.category as string) || '',
    cuisine: Array.isArray(s.cuisine) ? s.cuisine as string[] : ((s.cuisine as string) || '').split(',').map((c) => c.trim()).filter(Boolean),
    address: (s.address as string) || '',
    city: (s.city as string) || '',
    phone: (s.phone as string) || '',
    email: (s.email as string) || '',
    website: (s.website as string) || undefined,
    googleMapsUrl: (s.googleMapsUrl as string) || undefined,
    googlePlaceId: (s.googlePlaceId as string) || undefined,
    overallRating: (s.overallRating as number) || 0,
    totalReviews: (s.totalReviews as number) || 0,
    openingHours: Array.isArray(s.openingHours) ? (s.openingHours as Array<{ day: string; hours: string; isToday?: boolean }>) : [],
    socials: Array.isArray(s.socials) ? (s.socials as Array<{ platform: string; url: string; handle: string }>) : [],
    menu: Array.isArray(s.menu) ? s.menu : [],
    games: Array.isArray(s.games) ? s.games : [],
    reviews: Array.isArray(s.reviews) ? s.reviews : [],
    partyPackages: Array.isArray(s.partyPackages) ? s.partyPackages : [],
  };
}

export function useRestaurantQuery() {
  return useQuery({
    queryKey: ['restaurant', 'current'],
    queryFn: fetchCurrentRestaurant,
    staleTime: STALE_TIME,
  });
}

export function useUpdateRestaurantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RestaurantProfile>) =>
      apiClient('/restaurants/current', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });
}
