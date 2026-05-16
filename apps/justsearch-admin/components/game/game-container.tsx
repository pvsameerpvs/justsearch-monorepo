'use client';

import { useGamesQuery, useUpdateGameMutation } from '@/lib/hooks/use-games-query';
import { GamePresenter } from './game-presenter';

export function GameContainer() {
  const { games, isLoading } = useGamesQuery();
  const updateGame = useUpdateGameMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <GamePresenter
      games={games}
      activeCount={games.filter((g) => g.isActive).length}
      totalCount={games.length}
      onToggleAvailability={(id, isActive) => updateGame.mutate({ id, data: { isActive } })}
      onSaveScoring={(id, config) => updateGame.mutate({ id, data: config })}
    />
  );
}
