'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface SubmitScoreResult {
  pointsAwarded: number;
  totalToday: number;
  dailyCap: number;
}

export async function submitScore(gameId: string, rawScore: number, level?: number, customerId?: string): Promise<SubmitScoreResult> {
  try {
    const res = await fetch(`${API_BASE}/games/sessions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ gameId, rawScore, level, customerId }),
    });
    if (!res.ok) throw new Error('Score submission failed');
    return res.json() as Promise<SubmitScoreResult>;
  } catch {
    const basePoints = 10;
    const exponent = 0.7;
    const multiplier = 2.5;
    const maxPerPlay = 500;
    const pointsAwarded = Math.min(basePoints + Math.floor(Math.pow(Math.max(0, rawScore), exponent) * multiplier), maxPerPlay);
    return { pointsAwarded, totalToday: pointsAwarded, dailyCap: 2000 };
  }
}
