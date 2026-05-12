import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DELIVERY_SUFFIX = '-delivery';

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, '');
}

function resolveRestaurantSlug(host: string, baseDomain: string): string | null {
  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) {
    return null;
  }

  if (normalizedHost.endsWith('.localhost')) {
    const label = normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? '';
    return label.endsWith(DELIVERY_SUFFIX)
      ? label.slice(0, -DELIVERY_SUFFIX.length)
      : null;
  }

  if (!normalizedHost.endsWith(`.${baseDomain}`)) {
    return null;
  }

  const subdomain = normalizedHost.slice(0, -(baseDomain.length + 1));

  return subdomain.endsWith(DELIVERY_SUFFIX)
    ? subdomain.slice(0, -DELIVERY_SUFFIX.length)
    : null;
}

export function proxy(request: NextRequest) {
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'mydomain.com';
  const slug = resolveRestaurantSlug(request.headers.get('host') ?? '', baseDomain);
  const requestHeaders = new Headers(request.headers);

  if (slug) {
    requestHeaders.set('x-restaurant-slug', slug);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
