const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions extends RequestInit {
  tenantHost?: string;
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

export async function apiClient<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  if (options.tenantHost) {
    headers.set('host', options.tenantHost);
  }

  if (!headers.has('content-type') && options.body) {
    headers.set('content-type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.host.replace(/:\d+$/, '').toLowerCase();
    let slug = host.split('.')[0];
    if (slug === 'localhost') slug = 'demo-bistro';
    if (slug && slug !== 'admin') {
      headers.set('x-restaurant-slug', slug);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(
      error.message || `API error: ${response.status}`,
      response.status,
      error,
    );
  }

  return response.json() as Promise<T>;
}
