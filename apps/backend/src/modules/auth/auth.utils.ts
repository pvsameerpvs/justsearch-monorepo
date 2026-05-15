const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function normalizeMobile(raw: string): string {
  return raw.replace(/\s+/g, '');
}

export function isValidMobile(mobile: string): boolean {
  return /^\+?[0-9]{8,15}$/.test(normalizeMobile(mobile));
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
}

export function randomOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export { OTP_TTL_MS, MAX_ATTEMPTS };
