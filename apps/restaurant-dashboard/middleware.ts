import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    const response = NextResponse.next();
    response.headers.set('x-restaurant-slug', 'demo-bistro');
    return response;
  }

  // Block admin subdomain
  if (normalizedHost.startsWith(`admin.`)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Extract restaurant slug from host
  let slug = '';
  if (normalizedHost.endsWith(`.${BASE_DOMAIN}`)) {
    slug = normalizedHost.replace(`.${BASE_DOMAIN}`, '');
  }

  // Reject if no slug or contains reserved patterns
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
