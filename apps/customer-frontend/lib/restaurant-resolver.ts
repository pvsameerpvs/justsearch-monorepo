import { headers } from 'next/headers';
import { cache } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';
import { fetchCurrentRestaurant } from '@/lib/api/restaurants.api';
import type { ApiRestaurantData } from '@/lib/api/restaurants.api';

const BASE_DOMAINS = [
  'justsearchrestorant.com',
  'justsearch-restorantactivity.com',
  'justsearchrestaurant.com',
  'js-restorant.com',
];

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, '');
}

function extractSubdomain(host: string): string | null {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost) return null;
  if (normalizedHost.endsWith('.localhost')) {
    return normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? null;
  }
  for (const baseDomain of BASE_DOMAINS) {
    if (normalizedHost === baseDomain || normalizedHost === `www.${baseDomain}`) return null;
    if (normalizedHost.endsWith(`.${baseDomain}`)) {
      return normalizedHost.slice(0, -(baseDomain.length + 1)).split('.').filter(Boolean).at(-1) ?? null;
    }
  }
  const hostParts = normalizedHost.split('.').filter(Boolean);
  return hostParts.length >= 3 ? hostParts[0] ?? null : null;
}

function createEmptyRestaurant(slug: string): Restaurant {
  const name = slug
    ? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Restaurant';
  return {
    slug,
    subdomain: slug,
    name,
    tagline: '',
    description: '',
    logoUrl: undefined,
    heroImageUrl: undefined,
    category: '',
    cuisine: [],
    address: '',
    city: '',
    phone: '',
    email: '',
    website: undefined,
    googleMapsUrl: undefined,
    googlePlaceId: undefined,
    overallRating: 0,
    totalReviews: 0,
    theme: {
      brandColor: '15 118 110',
      brandSoft: '223 247 243',
      accentColor: '245 170 66',
      accentSoft: '255 238 209',
      surface: '255 255 255',
      ink: '15 23 42',
      muted: '94 108 132',
      border: '226 232 240',
      pageBackgroundFrom: '248 243 234',
      pageBackgroundTo: '255 255 255',
    },
    openingHours: [],
    socials: [],
    menu: [],
    games: [],
    reviews: [],
    partyPackages: [],
  };
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseCuisine(value: unknown): string[] {
  if (Array.isArray(value)) return (value as string[]).map((c) => str(c)).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((c) => c.trim()).filter(Boolean);
  return [];
}

function mapApiToRestaurant(data: ApiRestaurantData): Restaurant {
  const s = (data.settings as Record<string, unknown> | null) ?? {};

  return {
    id: data.id,
    slug: data.slug,
    subdomain: data.subdomain,
    name: data.name,
    tagline: str(s.tagline),
    description: str(s.description),
    logoUrl: str(s.logoUrl) || undefined,
    heroImageUrl: str(s.heroImageUrl) || undefined,
    category: str(s.category),
    cuisine: parseCuisine(s.cuisine),
    address: str(s.address),
    city: str(s.city),
    phone: str(s.phone),
    email: str(s.email),
    website: str(s.website) || undefined,
    googleMapsUrl: str(s.googleMapsUrl) || undefined,
    googlePlaceId: str(s.googlePlaceId) || undefined,
    overallRating: num(s.overallRating),
    totalReviews: num(s.totalReviews),
    theme: {
      brandColor: data.theme?.brandColor ?? '15 118 110',
      brandSoft: data.theme?.brandSoft ?? '223 247 243',
      accentColor: data.theme?.accentColor ?? '245 170 66',
      accentSoft: data.theme?.accentSoft ?? '255 238 209',
      surface: data.theme?.surface ?? '255 255 255',
      ink: data.theme?.ink ?? '15 23 42',
      muted: data.theme?.muted ?? '94 108 132',
      border: data.theme?.border ?? '226 232 240',
      pageBackgroundFrom: data.theme?.pageBackgroundFrom ?? '248 243 234',
      pageBackgroundTo: data.theme?.pageBackgroundTo ?? '255 255 255',
      cardSurface: data.theme?.cardSurface ?? '255 255 255',
      cardSurfaceMuted: data.theme?.cardSurfaceMuted ?? '248 250 252',
      cardBorder: data.theme?.cardBorder ?? '226 232 240',
      logoGradientFrom: data.theme?.logoGradientFrom ?? '99 102 241',
      logoGradientTo: data.theme?.logoGradientTo ?? '168 85 247',
    },
    openingHours: arr<Record<string, unknown>>(s.openingHours).map((h, i) => {
      const day = str(h.day, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || 'Mon');
      // Support both old format (hours: string) and new format (open/close/isOpen)
      if (h.hours && !h.open) {
        const parts = str(h.hours).split(/[–\-]/).map((s) => s.trim());
        return { day, open: parts[0] || '09:00', close: parts[1] || '22:00', isOpen: true, isToday: Boolean(h.isToday) };
      }
      return {
        day,
        open: str(h.open, '09:00'),
        close: str(h.close, '22:00'),
        isOpen: typeof h.isOpen === 'boolean' ? h.isOpen : true,
        isToday: Boolean(h.isToday),
      };
    }),
    socials: arr<Record<string, string>>(s.socials).map((s) => ({
      platform: str(s.platform) as 'Instagram',
      url: str(s.url),
      handle: str(s.handle),
    })) as Restaurant['socials'],
    menu: arr(s.menu),
    games: [],
    reviews: arr(s.reviews),
    partyPackages: arr(s.partyPackages),
  };
}

export const getCurrentRestaurant = cache(async (): Promise<Restaurant> => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';
  const normalizedHost = normalizeHost(host);
  const apiRestaurant = await fetchCurrentRestaurant(normalizedHost);
  const base = apiRestaurant
    ? mapApiToRestaurant(apiRestaurant)
    : createEmptyRestaurant(extractSubdomain(host) ?? 'unknown');
  return { ...base, games: PLATFORM_GAMES };
});

export function getRestaurantDomain(restaurant: Restaurant): string {
  return `${restaurant.subdomain}.justsearchrestorant.com`;
}

export function getRestaurantInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
