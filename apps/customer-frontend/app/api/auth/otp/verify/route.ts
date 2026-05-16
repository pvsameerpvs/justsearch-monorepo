import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const headers = new Headers({ 'content-type': 'application/json' });
    const host = request.headers.get('host') ?? '';
    if (host) headers.set('x-forwarded-host', host);

    const slug = host.split('.')[0] || process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    if (slug && slug !== 'admin') headers.set('x-restaurant-slug', slug);

    const backendRes = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await backendRes.json().catch(() => ({ error: 'Unknown error' }));

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const response = NextResponse.json(data, { status: 200 });

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
