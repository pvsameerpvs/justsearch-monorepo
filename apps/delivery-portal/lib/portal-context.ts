import { headers } from 'next/headers';
import { cache } from 'react';
import { getDeliveryPortalSnapshotBySlug } from './mock-delivery-data';

const DEFAULT_RESTAURANT_SLUG =
  process.env.NEXT_PUBLIC_DEV_RESTAURANT_SLUG ?? 'mosaic-table';

const DEFAULT_BASE_DOMAIN =
  process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, '');
}

function extractParts(host: string): { slug: string | null; agentId: string | null } {
  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) return { slug: null, agentId: null };

  let subdomain = '';
  if (normalizedHost.endsWith(`.${DEFAULT_BASE_DOMAIN}`)) {
    subdomain = normalizedHost.slice(0, -(DEFAULT_BASE_DOMAIN.length + 1));
  } else if (normalizedHost.endsWith('.localhost')) {
    subdomain = normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? '';
  }

  if (!subdomain) return { slug: null, agentId: null };

  // Parse: restaurantname-agentid
  const lastDashIndex = subdomain.lastIndexOf('-');
  if (lastDashIndex <= 0) return { slug: null, agentId: null };

  const slug = subdomain.slice(0, lastDashIndex);
  const agentId = subdomain.slice(lastDashIndex + 1);

  return { slug, agentId };
}

export const getCurrentDeliveryPortalSnapshot = cache(async () => {
  const headerStore = await headers();
  const forwardedSlug = headerStore.get('x-restaurant-slug');
  const forwardedAgentId = headerStore.get('x-delivery-boy-id');

  if (forwardedSlug && forwardedAgentId) {
    const snapshot = getDeliveryPortalSnapshotBySlug(forwardedSlug);
    return { ...snapshot, agentId: forwardedAgentId };
  }

  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';
  const { slug, agentId } = extractParts(host);

  const resolvedSlug = slug ?? DEFAULT_RESTAURANT_SLUG;
  const snapshot = getDeliveryPortalSnapshotBySlug(resolvedSlug);

  return { ...snapshot, agentId: agentId ?? 'unknown' };
});
