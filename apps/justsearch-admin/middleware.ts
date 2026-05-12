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

  // Only allow admin subdomain
  if (!normalizedHost.startsWith(`admin.`)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
