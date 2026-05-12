import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    return NextResponse.next();
  }

  // Block admin subdomain
  if (normalizedHost.startsWith(`admin.`)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Extract subdomain
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
