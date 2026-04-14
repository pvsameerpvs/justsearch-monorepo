/**
 * Memory Match - Model
 * Card definitions and game constants.
 */

export type GameState = 'START' | 'PLAYING' | 'INTER-LEVEL' | 'GAMEOVER';

export interface Card {
  id: number;
  value: string; // Emoji symbols
  isFlipped: boolean;
  isMatched: boolean;
  index: number;
}

export interface LevelConfig {
  gridSize: { cols: number; rows: number };
  timeLimit: number;
  numPairs: number;
}

export const MEMORY_MATCH_CONFIG = {
  FPS: 60,
  BASE_CARD_SIZE: 120,
  MAX_AWARD_POINTS: 5000,
  POINTS_PER_PAIR: 50,
  LEVEL_BONUS: 200,
  // Expanded symbol pool for higher levels
  SYMBOL_POOL: ['💎', '💍', '✨', '🌟', '🔮', '🍭', '🧁', '🍒', '🌈', '🔥', '⭐️', '🍀', '🍎', '🎨', '🚀', '🎸', '🍦', '🍩'],
  COLORS: {
    CARD_BACK: '#1e293b', // Darker slate
    CARD_FRONT: '#ffffff',
    BACKGROUND: '#0f172a', // Deep navy/slate
    TEXT: '#f8fafc',
    MATCHED: '#10b981',
  }
};

export function getLevelConfig(level: number): LevelConfig {
  let cols = 4;
  let rows = 4;
  
  // Difficulty Progression
  if (level >= 3 && level < 6) {
    rows = 5; // 20 cards
  } else if (level >= 6) {
    cols = 4;
    rows = 6; // 24 cards
  }
  
  const numPairs = (cols * rows) / 2;
  const timeLimit = Math.max(15, 60 - (level - 1) * 3);

  return {
    gridSize: { cols, rows },
    timeLimit,
    numPairs
  };
}

export function calculateAwardPoints(totalPairsMatched: number, level: number): number {
  const basePoints = totalPairsMatched * MEMORY_MATCH_CONFIG.POINTS_PER_PAIR;
  const levelPoints = (level - 1) * MEMORY_MATCH_CONFIG.LEVEL_BONUS;
  return Math.min(MEMORY_MATCH_CONFIG.MAX_AWARD_POINTS, basePoints + levelPoints);
}
