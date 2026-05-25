import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development — default to naples so all data loads immediately
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    const response = NextResponse.next();
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    response.headers.set('x-restaurant-slug', defaultSlug);
    return response;
  }

  // Extract restaurant slug from *.delivery.eatygo.com
  // e.g. naples.delivery.eatygo.com -> naples
  let slug = '';
  if (normalizedHost.endsWith(`.delivery.${BASE_DOMAIN}`)) {
    slug = normalizedHost.replace(`.delivery.${BASE_DOMAIN}`, '');
  } else {
    // Reject non-delivery domains — this service only serves *.delivery.*
    return new NextResponse('Not Found', { status: 404 });
  }

  if (!slug || slug.includes('.')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const response = NextResponse.next();
  response.headers.set('x-restaurant-slug', slug);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
