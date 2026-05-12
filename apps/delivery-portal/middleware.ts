import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'js-restorant.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    return NextResponse.next();
  }

  // Extract slug from delivery subdomain
  let fullSlug = '';
  if (normalizedHost.endsWith(`.${BASE_DOMAIN}`)) {
    fullSlug = normalizedHost.replace(`.${BASE_DOMAIN}`, '');
  }

  if (!fullSlug || fullSlug.includes('.')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Parse restaurant name and delivery boy ID
  const lastDashIndex = fullSlug.lastIndexOf('-');
  if (lastDashIndex <= 0) {
    return new NextResponse('Invalid delivery portal URL', { status: 404 });
  }

  const restaurantSlug = fullSlug.slice(0, lastDashIndex);
  const deliveryBoyId = fullSlug.slice(lastDashIndex + 1);

  if (!restaurantSlug || !deliveryBoyId) {
    return new NextResponse('Invalid delivery portal URL', { status: 404 });
  }

  const response = NextResponse.next();
  response.headers.set('x-restaurant-slug', restaurantSlug);
  response.headers.set('x-delivery-boy-id', deliveryBoyId);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
