"use client";

import { useGameStore } from '@/lib/stores/game-store';
import { GamePresenter } from './game-presenter';

export function GameContainer() {
  const { games, toggleAvailability } = useGameStore();

  return (
    <GamePresenter
      games={games}
      activeCount={games.filter((g) => g.isAvailable).length}
      totalCount={games.length}
      onToggleAvailability={toggleAvailability}
    />
  );
}
