import type { Request } from 'express';

export function resolveSubdomain(req: Request): string | null {
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'eatygo.com';

  // Priority 1: x-restaurant-slug header (sent by all frontend apps)
  // This takes precedence because API calls come from api.eatygo.com which
  // would otherwise resolve to subdomain "api" from the Host header.
  const slugHeader = (req.headers['x-restaurant-slug'] as string)?.trim().toLowerCase();
  if (slugHeader) {
    // Strip legacy flat suffixes if present
    if (slugHeader.endsWith('-admin')) return slugHeader.slice(0, -6);
    if (slugHeader.endsWith('-delivery')) return slugHeader.slice(0, -9);
    return slugHeader;
  }

  // Priority 2: Extract from Host / x-forwarded-host
  const host =
    (req.headers['x-forwarded-host'] as string) || req.headers.host || '';

  let remainingHost = '';
  const normalizedHost = host.toLowerCase().replace(/:\d+$/, '');

  // Nested subdomain support for Railway:
  // naples.admin.eatygo.com -> naples
  // naples.delivery.eatygo.com -> naples
  // naples.eatygo.com -> naples
  // naples.admin.localhost -> naples (dev)
  if (normalizedHost.endsWith(`.admin.${baseDomain}`)) {
    remainingHost = normalizedHost.replace(`.admin.${baseDomain}`, '');
  } else if (normalizedHost.endsWith(`.delivery.${baseDomain}`)) {
    remainingHost = normalizedHost.replace(`.delivery.${baseDomain}`, '');
  } else if (normalizedHost.endsWith(`.${baseDomain}`)) {
    remainingHost = normalizedHost.replace(`.${baseDomain}`, '');
  } else if (normalizedHost.endsWith('.localhost')) {
    remainingHost = normalizedHost.replace('.localhost', '');
    // For localhost, also strip .admin. and .delivery. suffixes
    if (remainingHost.endsWith('.admin')) {
      remainingHost = remainingHost.replace('.admin', '');
    } else if (remainingHost.endsWith('.delivery')) {
      remainingHost = remainingHost.replace('.delivery', '');
    }
  }

  // Extract first segment = actual restaurant slug
  // e.g. "naples" or reject multi-level like "foo.bar"
  let subdomain = remainingHost.split('.')[0] || '';

  // Reject if remainingHost still has dots (multi-level subdomain)
  if (remainingHost.includes('.')) {
    return null;
  }

  // Reject reserved / root domains and API domain
  if (
    !subdomain ||
    normalizedHost === baseDomain ||
    normalizedHost === `admin.${baseDomain}` ||
    subdomain === 'api'
  ) {
    return null;
  }

  // Legacy flat suffix stripping (kept for backwards compatibility)
  if (subdomain.endsWith('-admin')) {
    subdomain = subdomain.slice(0, -6);
  } else if (subdomain.endsWith('-delivery')) {
    subdomain = subdomain.slice(0, -9);
  }

  return subdomain;
}
