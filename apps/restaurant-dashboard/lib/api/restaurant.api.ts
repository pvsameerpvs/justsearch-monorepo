import { apiClient } from '@/lib/api-client';

export type RestaurantProfile = {
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
  openingHours: OpeningHour[];
  socials: SocialLink[];
  menu: unknown[];
  games: unknown[];
  reviews: unknown[];
  partyPackages: unknown[];
};

type OpeningHour = { day: string; open: string; close: string; isOpen: boolean; isToday?: boolean };
type SocialLink = { platform: string; url: string; handle: string };

type ApiResponse = {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  theme: Record<string, string>;
  settings: Record<string, unknown>;
};

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function strArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

function buildProfile(data: ApiResponse): RestaurantProfile {
  const s = data.settings || {};
  return {
    id: data.id,
    slug: data.slug,
    subdomain: data.subdomain,
    name: data.name,
    status: data.status,
    theme: data.theme || {},
    heroImageUrl: str(s.heroImageUrl) || undefined,
    logoUrl: str(s.logoUrl) || undefined,
    tagline: str(s.tagline),
    description: str(s.description),
    category: str(s.category),
    cuisine: strArray(s.cuisine),
    address: str(s.address),
    city: str(s.city),
    phone: str(s.phone),
    email: str(s.email),
    website: str(s.website) || undefined,
    googleMapsUrl: str(s.googleMapsUrl) || undefined,
    googlePlaceId: str(s.googlePlaceId) || undefined,
    overallRating: num(s.overallRating),
    totalReviews: num(s.totalReviews),
    openingHours: arr<Record<string, unknown>>(s.openingHours).map((h, i) => {
      const day = str(h.day, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || 'Mon');
      if (h.hours && !h.open) {
        const parts = str(h.hours).split(/[–\-]/).map((s) => s.trim());
        return { day, open: parts[0] || '09:00', close: parts[1] || '22:00', isOpen: true, isToday: Boolean(h.isToday) };
      }
      return { day, open: str(h.open, '09:00'), close: str(h.close, '22:00'), isOpen: typeof h.isOpen === 'boolean' ? h.isOpen : true, isToday: Boolean(h.isToday) };
    }),
    socials: arr(s.socials),
    menu: arr(s.menu),
    games: arr(s.games),
    reviews: arr(s.reviews),
    partyPackages: arr(s.partyPackages),
  };
}

export async function fetchCurrentRestaurant(): Promise<RestaurantProfile> {
  const data = await apiClient<ApiResponse>('/restaurants/current');
  return buildProfile(data);
}

export async function updateCurrentRestaurant(
  id: string,
  data: Partial<RestaurantProfile>,
): Promise<void> {
  await apiClient(`/restaurants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
