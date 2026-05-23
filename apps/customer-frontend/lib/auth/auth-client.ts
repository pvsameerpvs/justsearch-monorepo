import { readRefreshToken, writeAccessToken, writeRefreshToken, clearTokens, setSessionInvalidated } from './token-utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user?: Record<string, unknown>;
}

type RefreshResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'unauthorized' };

let isRefreshing = false;
let refreshPromise: Promise<RefreshResult> | null = null;

async function doRefresh(): Promise<RefreshResult> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) return { ok: false, reason: 'unauthorized' };

  let res: Response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch {
    clearTimeout(timeoutId);
    return { ok: false, reason: 'network' };
  }

  if (res.status === 401) {
    return { ok: false, reason: 'unauthorized' };
  }

  if (!res.ok) {
    return { ok: false, reason: 'network' };
  }

  const data = (await res.json()) as RefreshResponse;
  if (!data.accessToken || !data.refreshToken) {
    return { ok: false, reason: 'unauthorized' };
  }

  writeAccessToken(data.accessToken);
  writeRefreshToken(data.refreshToken);
  return { ok: true };
}

export async function attemptSilentRefresh(): Promise<RefreshResult> {
  if (isRefreshing) {
    return refreshPromise ?? Promise.resolve({ ok: false, reason: 'network' });
  }

  isRefreshing = true;
  refreshPromise = doRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

export function invalidateAuthSession() {
  clearTokens();
  setSessionInvalidated();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:session-invalidated'));
  }
}

export async function logoutFromBackend(): Promise<void> {
  const refreshToken = readRefreshToken();
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // ignore network errors
  }
  invalidateAuthSession();
}
