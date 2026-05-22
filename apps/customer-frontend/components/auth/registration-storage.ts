import type { RegisteredUser } from './registered-user';
import {
  writeAccessToken,
  writeRefreshToken,
  readAccessToken,
  readRefreshToken,
  clearTokens,
  setSessionInvalidated,
  clearSessionInvalidated,
  isSessionInvalidated,
} from '@/lib/auth/token-utils';

const STORAGE_KEY = 'justsearch:registeredUser';
const LEGACY_TOKEN_KEY = 'justsearch:authToken';
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
  return readFromStorage(window.localStorage) ?? readFromStorage(window.sessionStorage);
}

export function writeStoredUser(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      clearTokens();
      syncTokenCookie(null);
      return;
    }
    const payload = JSON.stringify(user);
    window.localStorage.setItem(STORAGE_KEY, payload);
    window.sessionStorage.setItem(STORAGE_KEY, payload);
    writeAccessToken(user.token);
    syncTokenCookie(user.token);
  } catch { /* ignore */ }
}

/**
 * Write dual tokens (access + refresh) alongside user profile.
 * Use this for new logins after refresh-token migration.
 */
export function writeStoredAuth(
  user: RegisteredUser,
  accessToken: string,
  refreshToken: string
) {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({ ...user, token: accessToken });
    window.localStorage.setItem(STORAGE_KEY, payload);
    window.sessionStorage.setItem(STORAGE_KEY, payload);
    writeAccessToken(accessToken);
    writeRefreshToken(refreshToken);
    syncTokenCookie(accessToken);
    clearSessionInvalidated();
  } catch { /* ignore */ }
}

export function readStoredToken(): string | null {
  // Prefer new dual-token storage, fall back to legacy single token
  return readAccessToken() ?? readLegacyToken();
}

export function readStoredRefreshToken(): string | null {
  return readRefreshToken();
}

function readLegacyToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(LEGACY_TOKEN_KEY) ?? window.sessionStorage.getItem(LEGACY_TOKEN_KEY) ?? null;
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

export function invalidateSession() {
  clearTokens();
  setSessionInvalidated();
  syncTokenCookie(null);
}

export { isSessionInvalidated, clearSessionInvalidated };
