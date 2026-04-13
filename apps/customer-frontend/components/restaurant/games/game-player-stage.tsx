"use client";

import type { Game } from '@/lib/restaurant-types';
import type { GameAwardHandler } from './game-award';
import { EmbeddedGamePlayer } from './embedded-game-player';
import { LocalGamePlayer } from './local-game-player';

type GamePlayerStageProps = {
  game: Game;
  onAward: GameAwardHandler;
  coins?: number;
};

export function GamePlayerStage({ game, onAward, coins }: GamePlayerStageProps) {
  if (game.type === 'embed') {
    return <EmbeddedGamePlayer game={game} />;
  }

  return <LocalGamePlayer game={game} onAward={onAward} coins={coins} />;
}
