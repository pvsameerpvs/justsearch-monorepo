const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

let isRefreshing = false;
let refreshPromise: Promise<RefreshResult> | null = null;

function readAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('justsearch:accessToken') ?? window.sessionStorage.getItem('justsearch:accessToken') ?? null;
}

function readRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('justsearch:refreshToken') ?? window.sessionStorage.getItem('justsearch:refreshToken') ?? null;
}

function writeTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('justsearch:accessToken', access);
  window.localStorage.setItem('justsearch:refreshToken', refresh);
  window.sessionStorage.setItem('justsearch:accessToken', access);
  window.sessionStorage.setItem('justsearch:refreshToken', refresh);
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('justsearch:accessToken');
  window.localStorage.removeItem('justsearch:refreshToken');
  window.sessionStorage.removeItem('justsearch:accessToken');
  window.sessionStorage.removeItem('justsearch:refreshToken');
}

type RefreshResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'unauthorized' };

async function doSilentRefresh(): Promise<RefreshResult> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) return { ok: false, reason: 'unauthorized' };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return { ok: false, reason: 'network' };
  }

  if (res.status === 401) {
    return { ok: false, reason: 'unauthorized' };
  }

  if (!res.ok) {
    return { ok: false, reason: 'network' };
  }

  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  if (!data.accessToken || !data.refreshToken) {
    return { ok: false, reason: 'unauthorized' };
  }

  writeTokens(data.accessToken, data.refreshToken);
  return { ok: true };
}

async function attemptRefresh(): Promise<RefreshResult> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve({ ok: false, reason: 'network' });
  isRefreshing = true;
  refreshPromise = doSilentRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

function getRestaurantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.host.replace(/:\d+$/, '').toLowerCase();
  const isLocalhost = host === 'localhost' || host.endsWith('.localhost');
  if (isLocalhost) {
    return localStorage.getItem('restaurant-slug');
  }
  const saved = localStorage.getItem('restaurant-slug');
  if (saved) return saved;
  let first = host.split('.')[0];
  if (!first || first === 'admin') return null;
  if (first.endsWith('-admin')) first = first.slice(0, -6);
  if (first.endsWith('-delivery')) first = first.slice(0, -9);
  if (first.startsWith('admin-')) first = first.slice(6);
  return first || null;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  if (!headers.has('content-type') && options.body) {
    headers.set('content-type', 'application/json');
  }

  headers.set('host', typeof window !== 'undefined' ? window.location.host : '');

  const slug = getRestaurantSlug();
  if (slug) {
    headers.set('x-restaurant-slug', slug);
  }

  const token = readAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  // Public auth endpoints should not trigger token refresh on 401
  const isPublicAuth = path === '/auth/login' || path === '/auth/register' || path === '/auth/refresh';

  if (response.status === 401 && !isPublicAuth) {
    const refreshResult = await attemptRefresh();
    if (refreshResult.ok) {
      return apiClient<T>(path, options);
    }
    if (refreshResult.reason === 'unauthorized') {
      const hadToken = Boolean(token);
      clearTokens();
      if (typeof window !== 'undefined' && hadToken) {
        window.dispatchEvent(new CustomEvent('auth:session-invalidated'));
      }
      throw new ApiError('Session expired. Please log in again.', 401);
    }
    throw new ApiError('Network error. Please check your connection and try again.', 0);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    const msg = error.message || error.error || `API error: ${response.status}`;
    throw new Error(msg);
  }

  return response.json() as Promise<T>;
}
