import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') ?? '';
  
  // Define base domain
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'mydomain.com';
  
  // Extract subdomain
  let subdomain = '';
  if (host.endsWith(`.${baseDomain}`)) {
    subdomain = host.replace(`.${baseDomain}`, '');
  } else if (host === baseDomain) {
    // Root domain - possibly redirect to justsearch-admin or landing page
    return NextResponse.next();
  }

  // Handle table parameter context
  const tableId = url.searchParams.get('table');
  
  // If we have a tableId, we might want to set a cookie or header 
  // to ensure the UI knows we are in 'Dine-in' mode.
  const response = NextResponse.next();
  
  if (subdomain) {
    response.headers.set('x-restaurant-slug', subdomain);
  }
  
  if (tableId) {
    response.headers.set('x-table-id', tableId);
    // You could also set a cookie to persist table session
    response.cookies.set('active_table_id', tableId, { path: '/' });
  }

  return response;
}

// Config to run on all pages except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
