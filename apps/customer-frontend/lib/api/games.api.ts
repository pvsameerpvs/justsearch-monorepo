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

export async function fetchActiveGames(host?: string): Promise<ActiveGamesResult> {
  try {
    const data = await apiClient<ActiveGamesResponse>('/games/active', {
      tenantHost: host,
    });
    return { names: data.games.map((g) => g.name), ok: true };
  } catch {
    return { names: [], ok: false };
  }
}
