import { NextResponse } from 'next/server';
import { requestOtp } from '@/lib/api/auth.api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const host = request.headers.get('host') ?? '';
    const data = await requestOtp(body, host);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request OTP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
