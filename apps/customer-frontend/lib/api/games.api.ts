import { apiClient } from './client';

export type ActiveGame = {
  id: string;
  name: string;
};

export type ActiveGamesResponse = {
  games: ActiveGame[];
};

export type ActiveGamesResult = {
  names: string[];
  ok: boolean;
};

export async function fetchActiveGames(): Promise<ActiveGamesResult> {
  try {
    const data = await apiClient<ActiveGamesResponse>('/games/active');
    return { names: data.games.map((g) => g.name), ok: true };
  } catch {
    return { names: [], ok: false };
  }
}
