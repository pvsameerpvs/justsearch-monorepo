import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const headers = new Headers({ 'content-type': 'application/json' });
    const rawHost = request.headers.get('host') ?? '';
    const host = rawHost.replace(/:\d+$/, '').toLowerCase();
    if (host) headers.set('x-forwarded-host', host);

    let slug = host.split('.')[0];
    if (slug === 'localhost') slug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    if (slug && slug !== 'admin') headers.set('x-restaurant-slug', slug);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let backendRes: Response;
    try {
      backendRes = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json({ error: 'Backend request timed out' }, { status: 504 });
    }

    const data = await backendRes.json().catch(() => ({ error: 'Unknown error' }));

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const response = NextResponse.json(data, { status: 200 });

    // Always set the token cookie so middleware can see it on subsequent requests
    if (data.token && typeof data.token === 'string') {
      response.cookies.set('token', data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
    }

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
