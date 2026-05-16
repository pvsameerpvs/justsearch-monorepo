const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getRestaurantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.host.replace(/:\d+$/, '').toLowerCase();
  let first = host.split('.')[0];
  if (!first || first === 'admin') return null;
  if (first === 'localhost') return 'demo-bistro';
  if (first.endsWith('-admin')) first = first.slice(0, -6);
  if (first.endsWith('-delivery')) first = first.slice(0, -9);
  if (first.startsWith('admin-')) first = first.slice(6);
  return first || null;
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

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
