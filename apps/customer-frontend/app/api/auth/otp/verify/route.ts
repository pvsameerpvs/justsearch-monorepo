import { NextResponse } from 'next/server';
import { getOtpRequestsStore, type OtpRequestRecord } from '@/lib/server/otp-store';

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const otpRequests: Map<string, OtpRequestRecord> = getOtpRequestsStore();

function normalizeMobile(raw: string) {
  return raw.replace(/\s+/g, '');
}

function isValidOtp(otp: string) {
  return /^[0-9]{4}$/.test(otp);
}

function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of otpRequests.entries()) {
    if (now - value.createdAt > OTP_TTL_MS) {
      otpRequests.delete(key);
    }
  }
}

export async function POST(request: Request) {
  cleanupExpired();

  const body = await request.json().catch(() => null) as null | {
    requestId?: unknown;
    mobile?: unknown;
    otp?: unknown;
  };

  const requestId = typeof body?.requestId === 'string' ? body.requestId : '';
  const mobile = typeof body?.mobile === 'string' ? normalizeMobile(body.mobile) : '';
  const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';

  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });
  }

  if (!mobile) {
    return NextResponse.json({ error: 'Missing mobile' }, { status: 400 });
  }

  if (!isValidOtp(otp)) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  const record = otpRequests.get(requestId);
  if (!record) {
    return NextResponse.json({ error: 'OTP request expired' }, { status: 400 });
  }

  if (record.mobile !== mobile) {
    return NextResponse.json({ error: 'Mobile does not match request' }, { status: 400 });
  }

  if (Date.now() - record.createdAt > OTP_TTL_MS) {
    otpRequests.delete(requestId);
    return NextResponse.json({ error: 'OTP request expired' }, { status: 400 });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpRequests.delete(requestId);
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  }

  record.attempts += 1;
  otpRequests.set(requestId, record);

  if (record.otp !== otp) {
    return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
  }

  otpRequests.delete(requestId);

  return NextResponse.json(
    {
      verified: true,
      user: {
        name: record.name,
        mobile: record.mobile,
      },
    },
    { status: 200 },
  );
}

export const dynamic = 'force-dynamic';
