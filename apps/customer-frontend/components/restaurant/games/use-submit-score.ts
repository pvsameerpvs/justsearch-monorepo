'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface SubmitScoreResult {
  pointsAwarded: number;
  totalToday: number;
  dailyCap: number;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('justsearch:authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function submitScore(gameId: string, rawScore: number, level?: number): Promise<SubmitScoreResult> {
  const res = await fetch(`${API_BASE}/games/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ gameId, rawScore, level }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Score submission failed' }));
    throw new Error(error.message || 'Score submission failed');
  }
  return res.json() as Promise<SubmitScoreResult>;
}
