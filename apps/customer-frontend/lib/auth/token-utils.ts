const ACCESS_TOKEN_KEY = 'justsearch:accessToken';
const REFRESH_TOKEN_KEY = 'justsearch:refreshToken';
const STORAGE_KEY = 'justsearch:registeredUser';
const SESSION_INVALIDATED_KEY = 'justsearch:sessionInvalidated';

export interface DecodedToken {
  exp: number;
  iat: number;
  sub?: string;
  id?: string;
  type?: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  const expiryMs = decoded.exp * 1000;
  return Date.now() + bufferSeconds * 1000 >= expiryMs;
}

export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return 0;
  return Math.max(0, decoded.exp * 1000 - Date.now());
}

export function readAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

export function readRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? window.sessionStorage.getItem(REFRESH_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

export function writeAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch { /* ignore */ }
}

export function writeRefreshToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch { /* ignore */ }
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

export function setSessionInvalidated() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_INVALIDATED_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

export function isSessionInvalidated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_INVALIDATED_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSessionInvalidated() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SESSION_INVALIDATED_KEY);
  } catch { /* ignore */ }
}
