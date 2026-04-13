"use client";

import type { Game } from '@/lib/restaurant-types';
import type { GameAwardHandler } from './game-award';
import { EmbeddedGamePlayer } from './embedded-game-player';
import { LocalGamePlayer } from './local-game-player';

type GamePlayerStageProps = {
  game: Game;
  onAward: GameAwardHandler;
};

export function GamePlayerStage({ game, onAward }: GamePlayerStageProps) {
  if (game.type === 'embed') {
    return <EmbeddedGamePlayer game={game} />;
  }

  return <LocalGamePlayer game={game} onAward={onAward} />;
}
