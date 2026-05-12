export type SliceMasterStatus = 'running' | 'finished';

export type SliceMasterFoodItem = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  sliceTime: number;
  type: FoodType;
  points: number;
};

export type FoodType =
  | 'apple'
  | 'banana'
  | 'orange'
  | 'watermelon'
  | 'pineapple'
  | 'bomb';

export type SliceTrail = {
  x: number;
  y: number;
  time: number;
};

export const SLICE_MASTER_CONFIG = {
  gravity: 800,
  spawnIntervalBase: 1200,
  spawnIntervalMin: 400,
  spawnIntervalDecrease: 30,
  itemRadius: 28,
  itemRadiusVar: 8,
  launchSpeedBase: 500,
  launchSpeedVar: 150,
  launchAngleMin: 70,
  launchAngleMax: 110,
  maxLives: 3,
  sliceRadius: 60,
  comboWindow: 800,
  comboMultiplier: 0.5,
  maxAwardPoints: 600,
  bombPenalty: 50,
} as const;

export const FOOD_TYPES: FoodType[] = [
  'apple',
  'banana',
  'orange',
  'watermelon',
  'pineapple',
];

export const FOOD_POINTS: Record<FoodType, number> = {
  apple: 10,
  banana: 15,
  orange: 10,
  watermelon: 25,
  pineapple: 20,
  bomb: 0,
};

export const FOOD_COLORS: Record<FoodType, string> = {
  apple: '#ef4444',
  banana: '#eab308',
  orange: '#f97316',
  watermelon: '#22c55e',
  pineapple: '#eab308',
  bomb: '#1f2937',
};

export const FOOD_EMOJIS: Record<FoodType, string> = {
  apple: '🍎',
  banana: '🍌',
  orange: '🍊',
  watermelon: '🍉',
  pineapple: '🍍',
  bomb: '💣',
};

export function computeAwardPoints(score: number, maxCombo: number): number {
  const comboBonus = Math.floor(maxCombo * SLICE_MASTER_CONFIG.comboMultiplier * 10);
  return Math.min(score + comboBonus, SLICE_MASTER_CONFIG.maxAwardPoints);
}
