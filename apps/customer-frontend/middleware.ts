import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development — use env-configured default slug
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    const response = NextResponse.next();
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    response.headers.set('x-restaurant-slug', defaultSlug);
    return response;
  }

  // Block admin and reserved nested subdomains
  // These are routed to other services by Railway:
  // *.admin.eatygo.com -> restaurant-dashboard
  // *.delivery.eatygo.com -> delivery-portal
  // admin.eatygo.com -> justsearch-admin
  if (
    normalizedHost.startsWith(`admin.`) ||
    normalizedHost.includes(`.admin.`) ||
    normalizedHost.includes(`.delivery.`)
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Extract restaurant subdomain from *.eatygo.com
  // e.g. naples.eatygo.com -> naples
  let subdomain = '';
  if (normalizedHost.endsWith(`.${BASE_DOMAIN}`)) {
    subdomain = normalizedHost.replace(`.${BASE_DOMAIN}`, '');
  } else if (normalizedHost === BASE_DOMAIN) {
    return NextResponse.next();
  }

  // Handle -booking suffix
  let restaurantSlug = subdomain;
  if (subdomain.endsWith('-booking')) {
    restaurantSlug = subdomain.replace('-booking', '');
  }

  const tableId = url.searchParams.get('table');
  const response = NextResponse.next();

  if (restaurantSlug) {
    response.headers.set('x-restaurant-slug', restaurantSlug);
  }

  if (tableId) {
    response.headers.set('x-table-id', tableId);
    response.cookies.set('active_table_id', tableId, { path: '/' });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
