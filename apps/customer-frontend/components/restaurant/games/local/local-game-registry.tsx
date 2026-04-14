"use client";

import { HungryBirdRushGame } from './hungry-bird-rush/hungry-bird-rush-game';
import { VexRunnerGame } from './vex-runner/vex-runner-game';
import { CheeseChaseGame } from './cheese-chase/cheese-chase-game';
import { MemoryMatchGame } from './memory-match/memory-match-game';
import type { LocalGameRenderer } from './local-game-renderer';

const LOCAL_GAME_REGISTRY: Record<string, LocalGameRenderer> = {
  'hungry-bird-rush': HungryBirdRushGame,
  'vex-runner': VexRunnerGame,
  'cheese-chase': CheeseChaseGame,
  'memory-match': MemoryMatchGame,
};

export function getLocalGameRenderer(localGameId: string): LocalGameRenderer | null {
  return LOCAL_GAME_REGISTRY[localGameId] ?? null;
}
