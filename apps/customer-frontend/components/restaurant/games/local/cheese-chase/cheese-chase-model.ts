/**
 * Cheese Chase - Model
 * Standard game constants and level logic
 */

export type GameState = 'START' | 'PLAYING' | 'INTER-LEVEL' | 'GAMEOVER';

export interface LevelConfig {
  gridSize: { cols: number; rows: number };
  timeLimit?: number; // in seconds
  hasFog?: boolean;
  traps?: number;
}

export const CHEESE_CHASE_CONFIG = {
  FPS: 60,
  BASE_CELL_SIZE: 100, // Will be scaled based on available space
  MAX_LEVEL: 50,
  POINTS_PER_LEVEL: 50,
  MAX_AWARD_POINTS: 2500,
  COLORS: {
    WALL: '#1e293b',
    FLOOR: '#f8fafc',
    MOUSE: '#94a3b8',
    CHEESE: '#f59e0b',
    PATH: '#f1f5f9',
  }
};

/**
 * Generate configuration for a specific level
 */
export function getLevelConfig(level: number): LevelConfig {
  // Linear increase in complexity
  const complexity = Math.floor(level / 2);
  const cols = Math.min(30, 6 + complexity);
  const rows = Math.min(30, 6 + complexity);

  // Time limit decreases as level increases (60s -> 10s minimum)
  const timeLimit = Math.max(10, 60 - level + 1);

  return {
    gridSize: { cols, rows },
    timeLimit,
    hasFog: level > 30, // Fog of war starts at level 30
    traps: level > 20 ? Math.floor(level / 10) : 0,
  };
}

/**
 * Map game score to reward points
 */
export function calculateAwardPoints(totalLevelsCompleted: number): number {
  return Math.min(
    CHEESE_CHASE_CONFIG.MAX_AWARD_POINTS,
    totalLevelsCompleted * CHEESE_CHASE_CONFIG.POINTS_PER_LEVEL
  );
}
