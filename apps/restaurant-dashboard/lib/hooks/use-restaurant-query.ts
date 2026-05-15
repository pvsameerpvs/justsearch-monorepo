import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Restaurant } from '@justsearch/utils';

const STALE_TIME = 30_000;

async function fetchCurrentRestaurant(): Promise<Restaurant> {
  const data = await apiClient<{
    id: string;
    slug: string;
    subdomain: string;
    name: string;
    status: string;
    theme: Record<string, unknown>;
    settings: Record<string, unknown>;
  }>('/restaurants/current');

  const settings = (data.settings || {}) as Record<string, unknown>;

  return {
    id: data.id,
    slug: data.slug,
    subdomain: data.subdomain,
    name: data.name,
    status: data.status,
    theme: data.theme as Restaurant['theme'],
    heroImageUrl: (settings.heroImageUrl as string) || undefined,
    logoUrl: (settings.logoUrl as string) || undefined,
    tagline: (settings.tagline as string) || '',
    description: (settings.description as string) || '',
    category: (settings.category as string) || '',
    cuisine: (settings.cuisine as string[]) || [],
    address: (settings.address as string) || '',
    city: (settings.city as string) || '',
    phone: (settings.phone as string) || '',
    email: (settings.email as string) || '',
    website: (settings.website as string) || undefined,
    googleMapsUrl: (settings.googleMapsUrl as string) || undefined,
    googlePlaceId: (settings.googlePlaceId as string) || undefined,
    overallRating: (settings.overallRating as number) || 0,
    totalReviews: (settings.totalReviews as number) || 0,
    openingHours: (settings.openingHours as Restaurant['openingHours']) || [],
    socials: (settings.socials as Restaurant['socials']) || [],
    menu: (settings.menu as Restaurant['menu']) || [],
    games: (settings.games as Restaurant['games']) || [],
    reviews: (settings.reviews as Restaurant['reviews']) || [],
    partyPackages: (settings.partyPackages as Restaurant['partyPackages']) || [],
  } as Restaurant;
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) =>
      apiClient(`/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
    },
  });
}
