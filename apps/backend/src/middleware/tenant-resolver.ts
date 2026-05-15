import type { Request } from 'express';

export function resolveSubdomain(req: Request): string | null {
  const host =
    (req.headers['x-forwarded-host'] as string) || req.headers.host || '';

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'mydomain.com';

  let subdomain = '';
  const normalizedHost = host.toLowerCase().replace(/:\d+$/, '');

  if (normalizedHost.endsWith(`.${baseDomain}`)) {
    subdomain = normalizedHost.replace(`.${baseDomain}`, '').split('.').pop() || '';
  } else if (normalizedHost.endsWith('.localhost')) {
    subdomain = normalizedHost.replace('.localhost', '').split('.').pop() || '';
  }

  const slugHeader = (req.headers['x-restaurant-slug'] as string)?.trim().toLowerCase();
  if (slugHeader && !subdomain) {
    subdomain = slugHeader;
  }

  if (!subdomain || normalizedHost === baseDomain) {
    if (slugHeader) {
      subdomain = slugHeader;
    } else {
      return null;
    }
  }

  if (subdomain.endsWith('-admin')) {
    subdomain = subdomain.slice(0, -6);
  } else if (subdomain.endsWith('-delivery')) {
    subdomain = subdomain.slice(0, -9);
  }

  return subdomain;
}
