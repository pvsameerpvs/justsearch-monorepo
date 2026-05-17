import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawHost = request.headers.get('host') ?? '';
    const host = rawHost.replace(/:\d+$/, '').toLowerCase();

    const headers = new Headers({ 'content-type': 'application/json' });
    if (host) headers.set('x-forwarded-host', host);

    let slug = host.split('.')[0];
    if (slug === 'localhost') slug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    if (slug && slug !== 'admin') headers.set('x-restaurant-slug', slug);

    const backendRes = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await backendRes.json().catch(() => ({ error: 'Unknown error' }));

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request OTP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
