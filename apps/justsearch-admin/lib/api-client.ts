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

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = readAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    if (message.includes('Failed to fetch')) {
      throw new Error('Cannot reach the server. Please check your connection or ensure the backend is running.');
    }
    throw new Error(message);
  }

  if (response.status === 401) {
    const refreshResult = await attemptRefresh();
    if (refreshResult.ok) {
      return apiClient<T>(path, options);
    }
    if (refreshResult.reason === 'unauthorized') {
      clearTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('auth:session-invalidated'));
      }
      throw new ApiError('Session expired. Please log in again.', 401);
    }
    throw new ApiError('Network error. Please check your connection and try again.', 0);
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let errorMessage = `API error: ${response.status}`;

    if (contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        // ignore parse errors
      }
    } else {
      try {
        const text = await response.text();
        if (text) errorMessage = text.slice(0, 200);
      } catch {
        // ignore read errors
      }
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
