const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
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
