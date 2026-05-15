'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AdminGame, ScoringConfig } from '@/lib/types/game.types';

const GAMES_KEY = ['games'] as const;

const DEFAULT_SCORING: ScoringConfig = {
  basePoints: 10,
  exponent: 0.7,
  multiplier: 2.5,
  maxPerPlay: 500,
  scoringVersion: 'v1',
};

function extractScoringConfig(config: Record<string, unknown>): ScoringConfig {
  const scoring = (config?.scoring as Partial<ScoringConfig>) || {};
  return { ...DEFAULT_SCORING, ...scoring };
}

async function fetchGames(): Promise<AdminGame[]> {
  const res = await apiClient<{ games: Array<{
    id: string;
    name: string;
    type: string;
    config: Record<string, unknown>;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
  }> }>('/games');
  return res.games.map((g) => ({
    id: g.id,
    name: g.name,
    description: (g.config.description as string) ?? '',
    localGameId: g.type,
    icon: (g.config.icon as string) ?? '🎮',
    prize: (g.config.prize as string) ?? '',
    maxPoints: (g.config.maxPoints as number) ?? 0,
    isActive: g.isActive,
    tag: (g.config.tag as string) ?? '',
    sponsorAd: (g.config.sponsorAd as boolean) ?? false,
    scoringConfig: extractScoringConfig(g.config),
  }));
}

export function useGamesQuery() {
  const { data: games = [], isLoading, error } = useQuery({
    queryKey: GAMES_KEY,
    queryFn: fetchGames,
  });
  return { games, isLoading, error };
}

export function useUpdateGameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient<{ game: AdminGame }>(`/games/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GAMES_KEY }),
  });
}
