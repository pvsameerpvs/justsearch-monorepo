import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getOtpRequestsStore } from '@/lib/server/otp-store';

const OTP_TTL_MS = 5 * 60 * 1000;
const otpRequests = getOtpRequestsStore();

function normalizeMobile(raw: string) {
  return raw.replace(/\s+/g, '');
}

function isValidMobile(mobile: string) {
  const normalized = normalizeMobile(mobile);
  return /^\+?[0-9]{8,15}$/.test(normalized);
}

function isValidName(name: string) {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
}

function randomOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
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
    name?: unknown;
    mobile?: unknown;
  };

  const name = typeof body?.name === 'string' ? body.name : '';
  const mobileRaw = typeof body?.mobile === 'string' ? body.mobile : '';
  const mobile = normalizeMobile(mobileRaw);

  if (!isValidName(name)) {
    return NextResponse.json(
      { error: 'Invalid name' },
      { status: 400 },
    );
  }

  if (!isValidMobile(mobile)) {
    return NextResponse.json(
      { error: 'Invalid mobile number' },
      { status: 400 },
    );
  }

  const requestId = randomUUID();
  const otp = randomOtp();

  otpRequests.set(requestId, {
    requestId,
    name: name.trim(),
    mobile,
    otp,
    createdAt: Date.now(),
    attempts: 0,
  });

  const payload: Record<string, unknown> = { requestId };

  if (process.env.NODE_ENV !== 'production') {
    payload.demoOtp = otp;
  }

  return NextResponse.json(payload, { status: 200 });
}

export const dynamic = 'force-dynamic';
