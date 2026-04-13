"use client";

import type { LocalGame } from '@/lib/restaurant-types';
import type { GameAwardHandler } from './game-award';
import { LocalGameFallback } from './local/local-game-fallback';
import { getLocalGameRenderer } from './local/local-game-registry';

type LocalGamePlayerProps = {
  game: LocalGame;
  onAward: GameAwardHandler;
  coins?: number;
};

export function LocalGamePlayer({ game, onAward, coins }: LocalGamePlayerProps) {
  const GameRenderer = getLocalGameRenderer(game.localGameId);

  if (!GameRenderer) {
    return <LocalGameFallback localGameId={game.localGameId} />;
  }

  return <GameRenderer game={game} onAward={onAward} coins={coins} />;
}
