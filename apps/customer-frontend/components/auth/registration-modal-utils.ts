export type OtpRequestResponse = {
  requestId: string;
};

export type OtpVerifyResponse = {
  verified: true;
  user: { name: string; mobile: string };
};

export function normalizeUaeLocalDigits(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('971')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 9);
}

export function isValidUaeLocalDigits(value: string) {
  return /^[0-9]{8,9}$/.test(value);
}

export function isValidName(value: string) {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
}

export function isValidOtp(value: string) {
  return /^[0-9]{4}$/.test(value);
}
