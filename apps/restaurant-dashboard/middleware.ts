import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development — no hardcoded slug; frontend api-client sends it via localStorage
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    return NextResponse.next();
  }

  // Extract restaurant slug from *.admin.eatygo.com
  // e.g. naples.admin.eatygo.com -> naples
  let slug = '';
  if (normalizedHost.endsWith(`.admin.${BASE_DOMAIN}`)) {
    slug = normalizedHost.replace(`.admin.${BASE_DOMAIN}`, '');
  } else if (normalizedHost.endsWith(`.${BASE_DOMAIN}`)) {
    // Fallback: reject direct *.eatygo.com access — this service only serves *.admin.*
    return new NextResponse('Not Found', { status: 404 });
  }

  // Reject if no slug or contains dots (invalid subdomain)
  if (!slug || slug.includes('.')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const response = NextResponse.next();
  if (slug) {
    response.headers.set('x-restaurant-slug', slug);
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
