import { headers } from 'next/headers';
import { cache } from 'react';
import { getDeliveryPortalSnapshotBySlug } from './mock-delivery-data';

const DEFAULT_RESTAURANT_SLUG =
  process.env.NEXT_PUBLIC_DEV_RESTAURANT_SLUG ?? 'mosaic-table';

const DEFAULT_BASE_DOMAIN =
  process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'mydomain.com';

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, '');
}

function stripDeliverySuffix(value: string): string | null {
  if (!value.endsWith('-delivery')) {
    return null;
  }

  return value.slice(0, -'-delivery'.length) || null;
}

function extractRestaurantSlug(host: string): string | null {
  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) {
    return null;
  }

  if (normalizedHost.endsWith('.localhost')) {
    const label = normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? '';
    return stripDeliverySuffix(label);
  }

  if (
    normalizedHost === DEFAULT_BASE_DOMAIN ||
    normalizedHost === `www.${DEFAULT_BASE_DOMAIN}`
  ) {
    return null;
  }

  if (normalizedHost.endsWith(`.${DEFAULT_BASE_DOMAIN}`)) {
    const subdomain = normalizedHost.slice(0, -(DEFAULT_BASE_DOMAIN.length + 1));
    return stripDeliverySuffix(subdomain);
  }

  const hostParts = normalizedHost.split('.').filter(Boolean);

  if (hostParts.length >= 3) {
    return stripDeliverySuffix(hostParts[0] ?? '');
  }

  return null;
}

export const getCurrentDeliveryPortalSnapshot = cache(async () => {
  const headerStore = await headers();
  const forwardedSlug = headerStore.get('x-restaurant-slug');
  const resolvedSlug =
    forwardedSlug ??
    extractRestaurantSlug(
      headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? ''
    ) ??
    DEFAULT_RESTAURANT_SLUG;

  return getDeliveryPortalSnapshotBySlug(resolvedSlug);
});
