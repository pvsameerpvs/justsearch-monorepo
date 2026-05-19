import type { RegisteredUser } from './registered-user';

const STORAGE_KEY = 'justsearch:registeredUser';
const TOKEN_KEY = 'justsearch:authToken';
const FRESH_REGISTRATION_KEY = 'justsearch:freshRegistration';

function parseUser(raw: unknown): RegisteredUser | null {
  if (!raw || typeof raw !== 'object' || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (
    typeof obj.id !== 'string' ||
    typeof obj.name !== 'string' ||
    typeof obj.mobile !== 'string' ||
    typeof obj.verifiedAt !== 'number' ||
    typeof obj.token !== 'string'
  )
    return null;
  return { id: obj.id, name: obj.name, mobile: obj.mobile, verifiedAt: obj.verifiedAt, token: obj.token };
}

export function readStoredUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeStoredUser(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.localStorage.setItem(TOKEN_KEY, user.token);
  } catch { /* ignore */ }
}

export function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function readFreshRegistration(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(FRESH_REGISTRATION_KEY);
    return raw ? parseUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeFreshRegistration(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!user) { window.sessionStorage.removeItem(FRESH_REGISTRATION_KEY); return; }
    window.sessionStorage.setItem(FRESH_REGISTRATION_KEY, JSON.stringify(user));
  } catch { /* ignore */ }
}

export function saveFreshRegistration(user: RegisteredUser | null) {
  writeFreshRegistration(user);
}

export function clearFreshRegistration() {
  writeFreshRegistration(null);
}
