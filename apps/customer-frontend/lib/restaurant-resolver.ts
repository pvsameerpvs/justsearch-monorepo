import { headers } from 'next/headers';
import { cache } from 'react';
import {
  getRestaurantBySlug,
  getFallbackRestaurant,
  type Restaurant,
} from '@justsearch/utils';

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

  if (!normalizedHost) {
    return null;
  }

  if (normalizedHost.endsWith('.localhost')) {
    return normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? null;
  }

  for (const baseDomain of BASE_DOMAINS) {
    if (normalizedHost === baseDomain || normalizedHost === `www.${baseDomain}`) {
      return null;
    }

    if (normalizedHost.endsWith(`.${baseDomain}`)) {
      const subdomain = normalizedHost.slice(0, -(baseDomain.length + 1));
      return subdomain.split('.').filter(Boolean).at(-1) ?? null;
    }
  }

  const hostParts = normalizedHost.split('.').filter(Boolean);

  if (hostParts.length >= 3) {
    return hostParts[0] ?? null;
  }

  return null;
}

async function fetchRestaurantFromApi(host: string): Promise<Restaurant | null> {
  try {
    const response = await fetch(`${API_BASE}/restaurants/current`, {
      headers: { host: normalizeHost(host) },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      id: string;
      slug: string;
      subdomain: string;
      name: string;
      status: string;
      theme: Record<string, string>;
      settings: Record<string, unknown>;
    };

    // Merge API data with mock data for fields not yet in DB
    const mock = getRestaurantBySlug(data.slug) ?? getFallbackRestaurant();

    return {
      ...mock,
      id: data.id,
      slug: data.slug,
      subdomain: data.subdomain,
      name: data.name,
      theme: { ...mock.theme, ...data.theme },
    };
  } catch {
    return null;
  }
}

export function resolveRestaurantFromHost(host: string): Restaurant {
  const subdomain = extractSubdomain(host);

  if (!subdomain) {
    return getFallbackRestaurant();
  }

  return getRestaurantBySlug(subdomain) ?? getFallbackRestaurant();
}

export const getCurrentRestaurant = cache(async (): Promise<Restaurant> => {
  const headerStore = await headers();
  const forwardedSlug = headerStore.get('x-restaurant-slug');

  if (forwardedSlug) {
    const restaurant = getRestaurantBySlug(forwardedSlug);
    if (restaurant) return restaurant;
  }

  const host =
    headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';

  // Try backend API first, fall back to mock data
  const apiRestaurant = await fetchRestaurantFromApi(host);
  if (apiRestaurant) return apiRestaurant;

  return resolveRestaurantFromHost(host);
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
