"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { GameAwardHandler } from '../../game-award';
import {
  SLICE_MASTER_CONFIG,
  FOOD_TYPES,
  FOOD_POINTS,
  computeAwardPoints,
} from './slice-master-model';
import { drawSliceMasterScene, drawGameOverScreen } from './slice-master-canvas-art';
import type {
  FoodType,
  SliceMasterFoodItem,
  SliceMasterStatus,
  SliceTrail,
} from './slice-master-model';

type UseSliceMasterEngineArgs = {
  onAward: GameAwardHandler;
  topScoreToBeat?: number;
};

type UseSliceMasterEngineResult = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  status: SliceMasterStatus;
  isTopScorer: boolean;
  score: number;
  restartGame: () => void;
};

export function useSliceMasterEngine({
  onAward,
  topScoreToBeat,
}: UseSliceMasterEngineArgs): UseSliceMasterEngineResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const awardedRef = useRef(false);

  const [status, setStatus] = useState<SliceMasterStatus>('running');
  const [isTopScorer, setIsTopScorer] = useState(false);
  const [score, setScore] = useState(0);

  const itemsRef = useRef<SliceMasterFoodItem[]>([]);
  const trailsRef = useRef<SliceTrail[]>([]);
  const livesRef = useRef(SLICE_MASTER_CONFIG.maxLives);
  const scoreRef = useRef(0);
  const maxComboRef = useRef(0);
  const comboCountRef = useRef(0);
  const lastSliceTimeRef = useRef(0);
  const nextSpawnRef = useRef(0);
  const spawnIntervalRef = useRef<number>(SLICE_MASTER_CONFIG.spawnIntervalBase);
  const lastTimeRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });

  const resetGameState = useCallback(() => {
    itemsRef.current = [];
    trailsRef.current = [];
    livesRef.current = SLICE_MASTER_CONFIG.maxLives;
    scoreRef.current = 0;
    maxComboRef.current = 0;
    comboCountRef.current = 0;
    lastSliceTimeRef.current = 0;
    nextSpawnRef.current = 0;
    spawnIntervalRef.current = SLICE_MASTER_CONFIG.spawnIntervalBase;
    lastTimeRef.current = 0;
    awardedRef.current = false;
    setIsTopScorer(false);
    setScore(0);
  }, []);

  const restartGame = useCallback(() => {
    resetGameState();
    setStatus('running');
  }, [resetGameState]);

  const spawnItem = useCallback((width: number, canvasHeight: number) => {
    const isBomb = Math.random() < 0.12;
    const type: FoodType = isBomb ? 'bomb' : FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    const angle =
      ((SLICE_MASTER_CONFIG.launchAngleMin +
        Math.random() * (SLICE_MASTER_CONFIG.launchAngleMax - SLICE_MASTER_CONFIG.launchAngleMin)) *
        Math.PI) /
      180;
    const speed =
      SLICE_MASTER_CONFIG.launchSpeedBase +
      Math.random() * SLICE_MASTER_CONFIG.launchSpeedVar;

    const item: SliceMasterFoodItem = {
      id: Date.now() + Math.random(),
      x: 40 + Math.random() * (width - 80),
      y: canvasHeight - 60,
      vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
      vy: -Math.sin(angle) * speed,
      radius: SLICE_MASTER_CONFIG.itemRadius + Math.random() * SLICE_MASTER_CONFIG.itemRadiusVar,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 4,
      sliced: false,
      sliceTime: 0,
      type,
      points: FOOD_POINTS[type],
    };

    itemsRef.current.push(item);
  }, []);

  const checkSlice = useCallback((now: number) => {
    if (trailsRef.current.length < 2) return;

    const lastTrail = trailsRef.current[trailsRef.current.length - 1];
    const prevTrail = trailsRef.current[trailsRef.current.length - 2];

    const dx = lastTrail.x - prevTrail.x;
    const dy = lastTrail.y - prevTrail.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) return;

    const midX = (lastTrail.x + prevTrail.x) / 2;
    const midY = (lastTrail.y + prevTrail.y) / 2;

    for (const item of itemsRef.current) {
      if (item.sliced) continue;

      const itemDx = item.x - midX;
      const itemDy = item.y - midY;
      const itemDist = Math.sqrt(itemDx * itemDx + itemDy * itemDy);

      if (itemDist < item.radius + SLICE_MASTER_CONFIG.sliceRadius) {
        item.sliced = true;
        item.sliceTime = now;
        item.vy = -100;
        item.vx = (Math.random() - 0.5) * 200;

        if (item.type === 'bomb') {
          livesRef.current -= 1;
          scoreRef.current = Math.max(0, scoreRef.current - SLICE_MASTER_CONFIG.bombPenalty);
        } else {
          // Combo logic
          const timeSinceLastSlice = now - lastSliceTimeRef.current;
          if (timeSinceLastSlice < SLICE_MASTER_CONFIG.comboWindow) {
            comboCountRef.current += 1;
          } else {
            comboCountRef.current = 1;
          }
          lastSliceTimeRef.current = now;

          maxComboRef.current = Math.max(maxComboRef.current, comboCountRef.current);

          const comboMultiplier = 1 + (comboCountRef.current - 1) * 0.5;
          scoreRef.current += Math.floor(item.points * comboMultiplier);
        }

        setScore(scoreRef.current);
      }
    }
  }, []);

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dt = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.1);
      lastTimeRef.current = now;

      const width = canvas.clientWidth || canvas.width || 800;
      const height = canvas.clientHeight || canvas.height || 500;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const targetWidth = Math.max(1, Math.round(width * dpr));
      const targetHeight = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== targetWidth) canvas.width = targetWidth;
      if (canvas.height !== targetHeight) canvas.height = targetHeight;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (status === 'running') {
        // Spawn items
        if (now >= nextSpawnRef.current) {
          spawnItem(width, height);
          nextSpawnRef.current = now + spawnIntervalRef.current;
          spawnIntervalRef.current = Math.max(
            SLICE_MASTER_CONFIG.spawnIntervalMin,
            spawnIntervalRef.current - SLICE_MASTER_CONFIG.spawnIntervalDecrease,
          );
        }

        // Update items
        const items = itemsRef.current;
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];

          if (!item.sliced) {
            item.vy += SLICE_MASTER_CONFIG.gravity * dt;
            item.x += item.vx * dt;
            item.y += item.vy * dt;
            item.rotation += item.rotationSpeed * dt;

            // Remove if fell off screen
            if (item.y > height + 50) {
              if (item.type !== 'bomb' && !item.sliced) {
                livesRef.current -= 1;
                comboCountRef.current = 0;
              }
              items.splice(i, 1);
            }
          } else {
            // Sliced items fall faster
            item.vy += SLICE_MASTER_CONFIG.gravity * 1.5 * dt;
            item.x += item.vx * dt;
            item.y += item.vy * dt;

            if (item.y > height + 50 || now - item.sliceTime > 500) {
              items.splice(i, 1);
            }
          }
        }

        // Check slice on pointer movement
        if (isPointerDownRef.current) {
          checkSlice(now);
        }

        // Clean old trails
        trailsRef.current = trailsRef.current.filter((t) => now - t.time < 200);

        // Game over check
        if (livesRef.current <= 0) {
          setStatus('finished');
          if (!awardedRef.current) {
            awardedRef.current = true;
            const reachedTopScore =
              typeof topScoreToBeat === 'number' ? scoreRef.current >= topScoreToBeat : false;
            setIsTopScorer(reachedTopScore);
            onAward({
              points: computeAwardPoints(scoreRef.current, maxComboRef.current),
              score: scoreRef.current,
              label: 'Slice Master',
            });
          }
        }
      }

      drawSliceMasterScene(
        ctx,
        width,
        height,
        itemsRef.current,
        trailsRef.current,
        scoreRef.current,
        livesRef.current,
        maxComboRef.current,
        now,
      );

      if (status === 'finished') {
        drawGameOverScreen(
          ctx,
          width,
          height,
          scoreRef.current,
          maxComboRef.current,
          isTopScorer,
        );
      }
    },
    [checkSlice, isTopScorer, onAward, spawnItem, status, topScoreToBeat],
  );

  useEffect(() => {
    const loop = (now: number) => {
      draw(now);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [draw]);

  // Pointer events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPoint = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (status === 'finished') {
        if (!isTopScorer) {
          restartGame();
        }
        return;
      }
      isPointerDownRef.current = true;
      const point = getPoint(e);
      pointerPosRef.current = point;
      trailsRef.current = [{ x: point.x, y: point.y, time: performance.now() }];
      if (typeof canvas.setPointerCapture === 'function') {
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || status === 'finished') return;
      const point = getPoint(e);
      pointerPosRef.current = point;
      trailsRef.current.push({ x: point.x, y: point.y, time: performance.now() });
      // Keep last 10 points
      if (trailsRef.current.length > 10) {
        trailsRef.current.shift();
      }
    };

    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      trailsRef.current = [];
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [isTopScorer, restartGame, status]);

  return {
    canvasRef,
    status,
    isTopScorer,
    score,
    restartGame,
  };
}
