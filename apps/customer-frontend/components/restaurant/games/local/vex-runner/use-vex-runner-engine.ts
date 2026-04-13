"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { GameAwardHandler } from '../../game-award';
import { drawFoodRunner } from './vex-runner-canvas-art';
import {
  VEX_RUNNER_CONFIG,
  VEX_RUNNER_DEFAULT_FOOD_ITEM,
  VEX_RUNNER_FOOD_ITEMS,
} from './vex-runner-model';
import type {
  VexRunnerFoodItem,
  VexRunnerFoodItemPreference,
  VexRunnerObstacle,
  VexRunnerStatus,
} from './vex-runner-model';

type UseVexRunnerEngineArgs = {
  onAward: GameAwardHandler;
  playerFoodItem: VexRunnerFoodItemPreference;
  topScoreToBeat?: number;
};

type UseVexRunnerEngineResult = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  status: VexRunnerStatus;
  isTopScorer: boolean;
  jump: () => void;
  restartGame: () => void;
};

type PlayerState = {
  y: number;
  velocity: number;
  isGrounded: boolean;
};

export function useVexRunnerEngine({
  onAward,
  playerFoodItem,
  topScoreToBeat,
}: UseVexRunnerEngineArgs): UseVexRunnerEngineResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const awardedRef = useRef(false);

  const [status, setStatus] = useState<VexRunnerStatus>('running');
  const [isTopScorer, setIsTopScorer] = useState(false);

  const playerRef = useRef<PlayerState>({ y: 0, velocity: 0, isGrounded: true });
  const obstaclesRef = useRef<VexRunnerObstacle[]>([]);
  const playerFoodItemRef = useRef<VexRunnerFoodItem>(VEX_RUNNER_DEFAULT_FOOD_ITEM);
  const scoreRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef(VEX_RUNNER_CONFIG.initialSpeed);

  const resolveFoodItem = useCallback(
    (
      preference: VexRunnerFoodItemPreference,
      previous: VexRunnerFoodItem | null = null,
    ): VexRunnerFoodItem => {
      if (preference !== 'random') {
        return preference;
      }

      const pool =
        previous === null
          ? [...VEX_RUNNER_FOOD_ITEMS]
          : VEX_RUNNER_FOOD_ITEMS.filter((item) => item !== previous);
      const selected = pool[Math.floor(Math.random() * pool.length)];
      return selected ?? VEX_RUNNER_DEFAULT_FOOD_ITEM;
    },
    [],
  );

  useEffect(() => {
    playerFoodItemRef.current = resolveFoodItem(playerFoodItem);
  }, [playerFoodItem, resolveFoodItem]);

  const resetGameState = useCallback(() => {
    playerRef.current = { y: 0, velocity: 0, isGrounded: true };
    obstaclesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = VEX_RUNNER_CONFIG.initialSpeed;
    lastTimeRef.current = 0;
    awardedRef.current = false;
    setIsTopScorer(false);
  }, []);

  const restartGame = useCallback(() => {
    playerFoodItemRef.current = resolveFoodItem(playerFoodItem, playerFoodItemRef.current);
    resetGameState();
    setStatus('running');
  }, [playerFoodItem, resetGameState, resolveFoodItem]);

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dt = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.1);
      lastTimeRef.current = now;

      const width = canvas.clientWidth || canvas.width || 800;
      const height = canvas.clientHeight || canvas.height || 400;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const targetWidth = Math.max(1, Math.round(width * dpr));
      const targetHeight = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== targetWidth) {
        canvas.width = targetWidth;
      }
      if (canvas.height !== targetHeight) {
        canvas.height = targetHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const floorY = height - VEX_RUNNER_CONFIG.floorHeight;

      if (status === 'running') {
        const player = playerRef.current;

        if (player.y === 0 && player.isGrounded) {
          player.y = floorY - VEX_RUNNER_CONFIG.playerSize;
        }

        player.velocity += VEX_RUNNER_CONFIG.gravity * dt;
        player.y += player.velocity * dt;

        if (player.y >= floorY - VEX_RUNNER_CONFIG.playerSize) {
          player.y = floorY - VEX_RUNNER_CONFIG.playerSize;
          player.velocity = 0;
          player.isGrounded = true;
        }

        speedRef.current += dt * VEX_RUNNER_CONFIG.speedIncreasePerSecond;

        const obstacles = obstaclesRef.current;
        for (let index = 0; index < obstacles.length; index += 1) {
          obstacles[index].x -= speedRef.current * dt;
        }

        if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
          obstacles.shift();
          scoreRef.current += VEX_RUNNER_CONFIG.scorePerObstacle;
        }

        const lastObstacle = obstacles[obstacles.length - 1];
        if (
          !lastObstacle ||
          lastObstacle.x <
            width -
              VEX_RUNNER_CONFIG.spawnWidthGapBase -
              Math.random() * VEX_RUNNER_CONFIG.spawnWidthGapRandom
        ) {
          obstacles.push({
            x: width,
            width: VEX_RUNNER_CONFIG.obstacleWidth,
            height:
              VEX_RUNNER_CONFIG.obstacleMinHeight +
              Math.random() * VEX_RUNNER_CONFIG.obstacleHeightRandom,
          });
        }

        const px = VEX_RUNNER_CONFIG.playerX;
        const py = player.y;
        const pw = VEX_RUNNER_CONFIG.playerSize;
        const ph = VEX_RUNNER_CONFIG.playerSize;

        for (const obstacle of obstacles) {
          const ox = obstacle.x;
          const oy = floorY - obstacle.height;
          const ow = obstacle.width;
          const oh = obstacle.height;

          if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
            setStatus('finished');
            if (!awardedRef.current) {
              awardedRef.current = true;
              const reachedTopScore =
                typeof topScoreToBeat === 'number' ? scoreRef.current >= topScoreToBeat : false;
              setIsTopScorer(reachedTopScore);
              onAward({
                points: Math.min(scoreRef.current, VEX_RUNNER_CONFIG.maxAwardPoints),
                score: scoreRef.current,
                label: 'Jump & Bite',
              });
            }
            break;
          }
        }
      }

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#c084fc');
      gradient.addColorStop(1, '#93c5fd');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, floorY, width, height - floorY);

      ctx.fillStyle = '#000';
      for (const obstacle of obstaclesRef.current) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x, floorY);
        ctx.lineTo(obstacle.x + obstacle.width / 2, floorY - obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width, floorY);
        ctx.fill();
      }

      drawFoodRunner(
        ctx,
        VEX_RUNNER_CONFIG.playerX,
        playerRef.current.y,
        VEX_RUNNER_CONFIG.playerSize,
        playerFoodItemRef.current,
        playerRef.current.velocity,
        now,
      );

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '800 24px ui-sans-serif, system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 20);

      if (status === 'finished') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = '800 36px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', width / 2, height / 2 - 20);
        ctx.font = '600 20px ui-sans-serif, system-ui';
        ctx.fillText(`Final Score: ${scoreRef.current}`, width / 2, height / 2 + 20);
        ctx.fillText(
          `Points Added: +${Math.min(scoreRef.current, VEX_RUNNER_CONFIG.maxAwardPoints)}`,
          width / 2,
          height / 2 + 50,
        );
        if (isTopScorer) {
          ctx.font = '800 22px ui-sans-serif, system-ui';
          ctx.fillStyle = '#facc15';
          ctx.fillText('You are the Top Scorer!', width / 2, height / 2 + 84);
        }
      }
    },
    [isTopScorer, onAward, status, topScoreToBeat],
  );

  useEffect(() => {
    const loop = (now: number) => {
      draw(now);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [draw]);

  const jump = useCallback(() => {
    if (status === 'finished') {
      if (isTopScorer) {
        return;
      }
      restartGame();
      return;
    }

    if (playerRef.current.isGrounded) {
      playerRef.current.velocity = VEX_RUNNER_CONFIG.jumpForce;
      playerRef.current.isGrounded = false;
    }
  }, [isTopScorer, restartGame, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jump]);

  return {
    canvasRef,
    status,
    isTopScorer,
    jump,
    restartGame,
  };
}
