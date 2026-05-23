import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const normalizedHost = host.replace(/:\d+$/, '').toLowerCase();

  // Allow localhost for development
  if (normalizedHost === 'localhost' || normalizedHost.endsWith('.localhost')) {
    return NextResponse.next();
  }

  // Only allow exact admin.eatygo.com (not *.admin.eatygo.com)
  // Railway routes admin.eatygo.com here
  // Railway routes *.admin.eatygo.com to restaurant-dashboard
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'eatygo.com';
  if (normalizedHost !== `admin.${baseDomain}`) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
