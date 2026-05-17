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


