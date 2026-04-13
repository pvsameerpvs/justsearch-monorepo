export type HungryBirdRushStatus = 'ready' | 'running' | 'finished';

export type HungryBirdRushPipe = {
  x: number;
  gapY: number;
  scored: boolean;
};

export type HungryBirdRushBirdState = {
  y: number;
  velocity: number;
};

export const HUNGRY_BIRD_RUSH_CONFIG = {
  gravity: 1450,
  flapVelocity: -420,
  maxFallSpeed: 640,
  birdX: 112,
  birdRadius: 16,
  pipeWidth: 70,
  pipeGapHeight: 210,
  pipeSpeed: 170,
  pipeSpawnIntervalSeconds: 1.85,
  minPipeSpacing: 320,
  maxGapShiftPerPipe: 110,
  initialPipeDelaySeconds: 1.35,
  firstPipeExtraDistance: 220,
  pipeMarginTop: 72,
  pipeMarginBottom: 96,
  floorHeight: 56,
  scorePerPipe: 12,
  survivalScorePerSecond: 2,
  maxAwardPoints: 700,
} as const;

export function calculateHungryBirdRushAwardPoints(score: number): number {
  return Math.min(Math.max(0, Math.floor(score)), HUNGRY_BIRD_RUSH_CONFIG.maxAwardPoints);
}
