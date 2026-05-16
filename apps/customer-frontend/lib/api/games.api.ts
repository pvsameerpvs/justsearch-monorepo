import { apiClient } from './client';

export type ActiveGame = {
  id: string;
  name: string;
};

export type ActiveGamesResponse = {
  games: ActiveGame[];
};

export async function fetchActiveGames(): Promise<string[]> {
  try {
    const data = await apiClient<ActiveGamesResponse>('/games/active');
    return data.games.map((g) => g.name);
  } catch {
    return [];
  }
}

export type SubmitScorePayload = {
  gameId: string;
  score: number;
  level?: number;
  playerId?: string;
};

export type SubmitScoreResponse = {
  pointsAwarded: number;
  dailyTotal: number;
  dailyCap: number;
};

export async function submitGameScore(payload: SubmitScorePayload): Promise<SubmitScoreResponse> {
  return apiClient<SubmitScoreResponse>('/games/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
