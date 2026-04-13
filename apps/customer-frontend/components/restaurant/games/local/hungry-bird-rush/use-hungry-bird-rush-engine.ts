"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { GameAwardHandler } from '../../game-award';
import { drawHungryBirdRushScene } from './hungry-bird-rush-canvas-art';
import {
  calculateHungryBirdRushAwardPoints,
  HUNGRY_BIRD_RUSH_CONFIG,
} from './hungry-bird-rush-model';
import type {
  HungryBirdRushBirdState,
  HungryBirdRushPipe,
  HungryBirdRushStatus,
} from './hungry-bird-rush-model';

type UseHungryBirdRushEngineArgs = {
  onAward: GameAwardHandler;
  topScoreToBeat?: number;
};

type UseHungryBirdRushEngineResult = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  status: HungryBirdRushStatus;
  score: number;
  isTopScorer: boolean;
  flap: () => void;
  restartGame: () => void;
};

function randomGapY(playHeight: number): number {
  const minY = HUNGRY_BIRD_RUSH_CONFIG.pipeMarginTop;
  const maxY =
    playHeight - HUNGRY_BIRD_RUSH_CONFIG.pipeGapHeight - HUNGRY_BIRD_RUSH_CONFIG.pipeMarginBottom;
  const safeMaxY = Math.max(minY, maxY);
  return minY + Math.random() * (safeMaxY - minY);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function nextGapY(playHeight: number, previousGapY?: number): number {
  const randomY = randomGapY(playHeight);
  if (typeof previousGapY !== 'number') {
    return randomY;
  }

  return clamp(
    randomY,
    previousGapY - HUNGRY_BIRD_RUSH_CONFIG.maxGapShiftPerPipe,
    previousGapY + HUNGRY_BIRD_RUSH_CONFIG.maxGapShiftPerPipe,
  );
}

export function useHungryBirdRushEngine({
  onAward,
  topScoreToBeat,
}: UseHungryBirdRushEngineArgs): UseHungryBirdRushEngineResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef(0);
  const runElapsedRef = useRef(0);
  const awardedRef = useRef(false);
  const scoreRef = useRef(0);
  const survivalAccumulatorRef = useRef(0);

  const birdRef = useRef<HungryBirdRushBirdState>({ y: 0, velocity: 0 });
  const pipesRef = useRef<HungryBirdRushPipe[]>([]);

  const [status, setStatus] = useState<HungryBirdRushStatus>('ready');
  const [score, setScore] = useState(0);
  const [isTopScorer, setIsTopScorer] = useState(false);

  const resetState = useCallback((nextStatus: HungryBirdRushStatus = 'ready') => {
    birdRef.current = { y: 0, velocity: 0 };
    pipesRef.current = [];
    lastTimeRef.current = 0;
    spawnTimerRef.current = 0;
    runElapsedRef.current = 0;
    awardedRef.current = false;
    scoreRef.current = 0;
    survivalAccumulatorRef.current = 0;
    setScore(0);
    setIsTopScorer(false);
    setStatus(nextStatus);
  }, []);

  const finishRound = useCallback(() => {
    setStatus((prev) => (prev === 'finished' ? prev : 'finished'));
    if (awardedRef.current) {
      return;
    }

    awardedRef.current = true;
    const finalScore = Math.max(0, Math.floor(scoreRef.current));
    const reachedTop =
      typeof topScoreToBeat === 'number' ? finalScore >= topScoreToBeat : false;
    setIsTopScorer(reachedTop);

    onAward({
      points: calculateHungryBirdRushAwardPoints(finalScore),
      score: finalScore,
      label: 'Hungry Bird Rush',
    });
  }, [onAward, topScoreToBeat]);

  const restartGame = useCallback(() => {
    resetState('ready');
  }, [resetState]);

  const ensureBirdReadyPosition = useCallback((playHeight: number) => {
    if (birdRef.current.y <= 0) {
      birdRef.current.y = Math.max(HUNGRY_BIRD_RUSH_CONFIG.birdRadius + 10, playHeight * 0.44);
    }
  }, []);

  const spawnPipe = useCallback((playWidth: number, playHeight: number) => {
    const isFirstPipe = pipesRef.current.length === 0;
    const previousGapY = pipesRef.current[pipesRef.current.length - 1]?.gapY;
    pipesRef.current.push({
      x:
        playWidth +
        HUNGRY_BIRD_RUSH_CONFIG.pipeWidth +
        20 +
        (isFirstPipe ? HUNGRY_BIRD_RUSH_CONFIG.firstPipeExtraDistance : 0),
      gapY: nextGapY(playHeight, previousGapY),
      scored: false,
    });
  }, []);

  const addScore = useCallback((points: number) => {
    if (points <= 0) return;
    scoreRef.current += points;
    setScore(Math.max(0, Math.floor(scoreRef.current)));
  }, []);

  const updateRunningRound = useCallback(
    (dt: number, playWidth: number, playHeight: number) => {
      if (status !== 'running') {
        return;
      }

      const bird = birdRef.current;
      runElapsedRef.current += dt;
      bird.velocity = Math.min(
        bird.velocity + HUNGRY_BIRD_RUSH_CONFIG.gravity * dt,
        HUNGRY_BIRD_RUSH_CONFIG.maxFallSpeed,
      );
      bird.y += bird.velocity * dt;

      spawnTimerRef.current += dt;
      if (runElapsedRef.current >= HUNGRY_BIRD_RUSH_CONFIG.initialPipeDelaySeconds) {
        const lastPipe = pipesRef.current[pipesRef.current.length - 1];
        const hasEnoughSpacing =
          !lastPipe || lastPipe.x <= playWidth - HUNGRY_BIRD_RUSH_CONFIG.minPipeSpacing;

        if (
          hasEnoughSpacing &&
          spawnTimerRef.current >= HUNGRY_BIRD_RUSH_CONFIG.pipeSpawnIntervalSeconds
        ) {
          spawnTimerRef.current = 0;
          spawnPipe(playWidth, playHeight);
        }
      }

      for (const pipe of pipesRef.current) {
        pipe.x -= HUNGRY_BIRD_RUSH_CONFIG.pipeSpeed * dt;
      }
      pipesRef.current = pipesRef.current.filter(
        (pipe) => pipe.x + HUNGRY_BIRD_RUSH_CONFIG.pipeWidth > -16,
      );

      const birdLeft = HUNGRY_BIRD_RUSH_CONFIG.birdX - HUNGRY_BIRD_RUSH_CONFIG.birdRadius;
      const birdRight = HUNGRY_BIRD_RUSH_CONFIG.birdX + HUNGRY_BIRD_RUSH_CONFIG.birdRadius;
      const birdTop = bird.y - HUNGRY_BIRD_RUSH_CONFIG.birdRadius;
      const birdBottom = bird.y + HUNGRY_BIRD_RUSH_CONFIG.birdRadius;

      for (const pipe of pipesRef.current) {
        const pipeRight = pipe.x + HUNGRY_BIRD_RUSH_CONFIG.pipeWidth;
        if (!pipe.scored && pipeRight < birdLeft) {
          pipe.scored = true;
          addScore(HUNGRY_BIRD_RUSH_CONFIG.scorePerPipe);
        }

        if (
          birdRight > pipe.x &&
          birdLeft < pipeRight &&
          (birdTop < pipe.gapY ||
            birdBottom > pipe.gapY + HUNGRY_BIRD_RUSH_CONFIG.pipeGapHeight)
        ) {
          finishRound();
          return;
        }
      }

      survivalAccumulatorRef.current += HUNGRY_BIRD_RUSH_CONFIG.survivalScorePerSecond * dt;
      if (survivalAccumulatorRef.current >= 1) {
        const bonus = Math.floor(survivalAccumulatorRef.current);
        survivalAccumulatorRef.current -= bonus;
        addScore(bonus);
      }

      if (birdTop <= 0 || birdBottom >= playHeight) {
        finishRound();
      }
    },
    [addScore, finishRound, spawnPipe, status],
  );

  const drawFrame = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.clientWidth || canvas.width || 800;
      const height = canvas.clientHeight || canvas.height || 400;
      const playHeight = Math.max(0, height - HUNGRY_BIRD_RUSH_CONFIG.floorHeight);

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const targetWidth = Math.max(1, Math.round(width * dpr));
      const targetHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== targetWidth) {
        canvas.width = targetWidth;
      }
      if (canvas.height !== targetHeight) {
        canvas.height = targetHeight;
      }

      const dt = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.1);
      lastTimeRef.current = now;

      ensureBirdReadyPosition(playHeight);
      updateRunningRound(dt, width, playHeight);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      drawHungryBirdRushScene({
        ctx,
        width,
        height,
        playHeight,
        now,
        status,
        score,
        bird: birdRef.current,
        pipes: pipesRef.current,
        isTopScorer,
        topScoreToBeat,
      });
    },
    [
      ensureBirdReadyPosition,
      isTopScorer,
      score,
      status,
      topScoreToBeat,
      updateRunningRound,
    ],
  );

  useEffect(() => {
    const loop = (now: number) => {
      drawFrame(now);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [drawFrame]);

  const flap = useCallback(() => {
    if (status === 'finished') {
      if (isTopScorer) {
        return;
      }
      restartGame();
      return;
    }

    if (status === 'ready') {
      setStatus('running');
      lastTimeRef.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
    }

    birdRef.current.velocity = HUNGRY_BIRD_RUSH_CONFIG.flapVelocity;
  }, [isTopScorer, restartGame, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        flap();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [flap]);

  return {
    canvasRef,
    status,
    score,
    isTopScorer,
    flap,
    restartGame,
  };
}
