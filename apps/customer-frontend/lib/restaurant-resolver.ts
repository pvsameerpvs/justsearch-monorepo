import { headers } from 'next/headers';
import { cache } from 'react';
import type { Restaurant, RestaurantTheme } from '@justsearch/utils';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';

const BASE_DOMAINS = [
  'justsearchrestorant.com',
  'justsearch-restorantactivity.com',
  'justsearchrestaurant.com',
  'js-restorant.com',
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

  const theme: RestaurantTheme = {
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
  };

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
    theme,
    openingHours: [],
    socials: [],
    menu: [],
    games: [],
    reviews: [],
    partyPackages: [],
  };
}

type ApiRestaurantData = {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  theme: Record<string, string>;
  settings: Record<string, unknown>;
};

function mapApiToRestaurant(data: ApiRestaurantData): Restaurant {
  const theme: RestaurantTheme = {
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
  };

  return {
    id: data.id,
    slug: data.slug,
    subdomain: data.subdomain,
    name: data.name,
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
    theme,
    openingHours: [],
    socials: [],
    menu: [],
    games: [],
    reviews: [],
    partyPackages: [],
  };
}

async function fetchRestaurantFromApi(host: string): Promise<Restaurant | null> {
  try {
    const response = await fetch(`${API_BASE}/restaurants/current`, {
      headers: { host: normalizeHost(host) },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json() as ApiRestaurantData;
    return mapApiToRestaurant(data);
  } catch {
    return null;
  }
}

export const getCurrentRestaurant = cache(async (): Promise<Restaurant> => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';
  const apiRestaurant = await fetchRestaurantFromApi(host);
  const base = apiRestaurant ?? createEmptyRestaurant(extractSubdomain(host) ?? 'unknown');
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
