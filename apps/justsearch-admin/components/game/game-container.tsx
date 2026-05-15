'use client';

import { useGamesQuery, useUpdateGameMutation, useDeleteGameMutation } from '@/lib/hooks/use-games-query';
import { GamePresenter } from './game-presenter';

export function GameContainer() {
  const { games, isLoading } = useGamesQuery();
  const updateGame = useUpdateGameMutation();
  const deleteGame = useDeleteGameMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <GamePresenter
      games={games}
      activeCount={games.filter((g) => g.isActive).length}
      totalCount={games.length}
      onToggleAvailability={(id, isActive) => updateGame.mutate({ id, data: { isActive } })}
      onDelete={(id) => deleteGame.mutate(id)}
    />
  );
}
