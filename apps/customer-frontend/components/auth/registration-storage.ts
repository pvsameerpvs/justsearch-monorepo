import type { RegisteredUser } from './registered-user';

const STORAGE_KEY = 'justsearch:registeredUser';
const TOKEN_KEY = 'justsearch:authToken';
const FRESH_REGISTRATION_KEY = 'justsearch:freshRegistration';
const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function syncTokenCookie(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    } else {
      document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  } catch { /* ignore */ }
}

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

function readFromStorage(storage: Storage): RegisteredUser | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? parseUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function readStoredUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  // Try localStorage first, then sessionStorage as backup
  return readFromStorage(window.localStorage) ?? readFromStorage(window.sessionStorage);
}

export function writeStoredUser(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(TOKEN_KEY);
      syncTokenCookie(null);
      return;
    }
    const payload = JSON.stringify(user);
    // Write to BOTH localStorage and sessionStorage for maximum durability
    window.localStorage.setItem(STORAGE_KEY, payload);
    window.localStorage.setItem(TOKEN_KEY, user.token);
    window.sessionStorage.setItem(STORAGE_KEY, payload);
    window.sessionStorage.setItem(TOKEN_KEY, user.token);
    syncTokenCookie(user.token);
  } catch { /* ignore */ }
}

export function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
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
