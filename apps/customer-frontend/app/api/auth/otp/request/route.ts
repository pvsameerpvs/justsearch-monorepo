import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const host = request.headers.get('host') ?? '';

  try {
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        host,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to request OTP' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
