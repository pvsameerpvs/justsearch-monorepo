import { headers } from 'next/headers';
import { cache } from 'react';
import { getRestaurantBySlug, mockRestaurants } from './mock-restaurants';
import type { Restaurant } from './restaurant-types';

const DEFAULT_RESTAURANT_SLUG =
  process.env.NEXT_PUBLIC_DEV_RESTAURANT_SLUG ?? 'mosaic-table';

const DEFAULT_PUBLIC_DOMAIN =
  process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN ?? 'justsearchrestorant.com';

const BASE_DOMAINS = [
  'justsearchrestorant.com',
  'justsearch-restorantactivity.com',
  'justsearchrestaurant.com',
];

function getFallbackRestaurant(): Restaurant {
  return (
    getRestaurantBySlug(DEFAULT_RESTAURANT_SLUG) ??
    mockRestaurants['mosaic-table']
  );
}

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

    if (restaurant) {
      return restaurant;
    }
  }

  const host =
    headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';

  return resolveRestaurantFromHost(host);
});

export function getRestaurantDomain(restaurant: Restaurant): string {
  return `${restaurant.subdomain}.${DEFAULT_PUBLIC_DOMAIN}`;
}

export function getRestaurantInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
