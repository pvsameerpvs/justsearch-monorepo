'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AdminGame } from '@/lib/stores/game-store';

const GAMES_KEY = ['games'] as const;

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
  }));
}

export function useGamesQuery() {
  const { data: games = [], isLoading, error } = useQuery({
    queryKey: GAMES_KEY,
    queryFn: fetchGames,
  });
  return { games, isLoading, error };
}

export function useCreateGameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: string; config?: Record<string, unknown>; isActive?: boolean }) =>
      apiClient<AdminGame>('/games', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GAMES_KEY }),
  });
}

export function useUpdateGameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; type: string; config?: Record<string, unknown>; isActive?: boolean }> }) =>
      apiClient<AdminGame>(`/games/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GAMES_KEY }),
  });
}

export function useDeleteGameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/games/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GAMES_KEY }),
  });
}
