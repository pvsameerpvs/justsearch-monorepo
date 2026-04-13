export type VexRunnerStatus = 'running' | 'finished';

export type VexRunnerObstacle = {
  x: number;
  width: number;
  height: number;
};

export const VEX_RUNNER_CONFIG = {
  gravity: 1500,
  jumpForce: -600,
  initialSpeed: 300,
  speedIncreasePerSecond: 10,
  floorHeight: 50,
  playerSize: 30,
  playerX: 100,
  maxAwardPoints: 500,
  spawnWidthGapBase: 400,
  spawnWidthGapRandom: 300,
  obstacleWidth: 30,
  obstacleMinHeight: 30,
  obstacleHeightRandom: 40,
} as const;
