import { readAccessToken } from '@/lib/auth/token-utils';
import { attemptSilentRefresh, invalidateAuthSession } from '@/lib/auth/auth-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions extends RequestInit {
  tenantHost?: string;
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return readAccessToken();
}

export async function apiClient<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  if (options.tenantHost) {
    headers.set('x-forwarded-host', options.tenantHost);
  }

  if (!headers.has('content-type') && options.body) {
    headers.set('content-type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.host.replace(/:\d+$/, '').toLowerCase();
    let slug = host.split('.')[0];
    if (slug === 'localhost') slug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    if (slug && slug !== 'admin') {
      headers.set('x-restaurant-slug', slug);
    }
  } else {
    // Server-side: derive slug from tenantHost if provided, otherwise use default
    let slug = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG || 'naples';
    if (options.tenantHost) {
      const host = options.tenantHost.replace(/:\d+$/, '').toLowerCase();
      const parts = host.split('.');
      if (parts.length >= 2 && parts[0] && parts[0] !== 'admin') {
        slug = parts[0];
      }
    }
    headers.set('x-restaurant-slug', slug);
  }

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutMs = options.timeout ?? 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Backend may be unreachable.', 0);
    }
    throw error;
  }

  if (response.status === 401) {
    const refreshResult = await attemptSilentRefresh();
    if (refreshResult.ok) {
      // Retry with new token
      return apiClient<T>(path, options);
    }
    if (refreshResult.reason === 'unauthorized') {
      // Refresh token also expired — session truly dead
      invalidateAuthSession();
      throw new ApiError('Session expired. Please log in again.', 401);
    }
    // Network error during refresh — keep session alive, let caller retry later
    throw new ApiError('Network error. Please check your connection and try again.', 0);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(
      error.message || `API error: ${response.status}`,
      response.status,
      error,
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
