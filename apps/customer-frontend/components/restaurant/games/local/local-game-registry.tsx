"use client";

import { VexRunnerGame } from './vex-runner/vex-runner-game';
import type { LocalGameRenderer } from './local-game-renderer';

const LOCAL_GAME_REGISTRY: Record<string, LocalGameRenderer> = {
  'vex-runner': VexRunnerGame,
};

export function getLocalGameRenderer(localGameId: string): LocalGameRenderer | null {
  return LOCAL_GAME_REGISTRY[localGameId] ?? null;
}
