'use client';

import { apiClient } from '@/lib/api/client';

interface SubmitScoreResult {
  pointsAwarded: number;
  totalToday: number;
  dailyCap: number;
}

export async function submitScore(gameId: string, rawScore: number, level?: number): Promise<SubmitScoreResult> {
  return apiClient<SubmitScoreResult>('/games/sessions', {
    method: 'POST',
    body: JSON.stringify({ gameId, rawScore, level }),
  });
}
