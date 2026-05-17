import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development — frontend api-client sends slug via header
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    return NextResponse.next();
  }

  // Only allow delivery subdomain patterns
  if (!normalizedHost.endsWith(`.${BASE_DOMAIN}`)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const slug = normalizedHost.replace(`.${BASE_DOMAIN}`, '');
  if (!slug || slug.includes('.')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const response = NextResponse.next();
  response.headers.set('x-restaurant-slug', slug.replace(/-delivery$/, ''));
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
