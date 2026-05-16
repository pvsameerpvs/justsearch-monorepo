import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/api/auth.api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await verifyOtp(body);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
