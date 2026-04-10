"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameAwardHandler } from './game-award';

type ScratchCardCanvasGameProps = {
  onAward: GameAwardHandler;
};

function randomPrize() {
  const prizes = [20, 40, 60, 80, 100, 120];
  return prizes[Math.floor(Math.random() * prizes.length)] ?? 20;
}

function scratchedPercent(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const data = ctx.getImageData(0, 0, width, height).data;
  const step = 16;
  let total = 0;
  let cleared = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3] ?? 255;
      total += 1;
      if (alpha < 16) cleared += 1;
    }
  }

  return total === 0 ? 0 : cleared / total;
}

export function ScratchCardCanvasGame({ onAward }: ScratchCardCanvasGameProps) {
  const [prizePoints, setPrizePoints] = useState(() => randomPrize());
  const [revealed, setRevealed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const awardedRef = useRef(false);
  const checkTimerRef = useRef<number | null>(null);

  const paintOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(148, 163, 184, 0.95)');
    gradient.addColorStop(1, 'rgba(226, 232, 240, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
    ctx.font = '800 30px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', width / 2, height / 2 - 10);
    ctx.font = '600 18px ui-sans-serif, system-ui';
    ctx.fillText('to reveal your prize', width / 2, height / 2 + 28);
    ctx.restore();
  }, []);

  useEffect(() => {
    awardedRef.current = false;
    setRevealed(false);
    paintOverlay();

    return () => {
      if (checkTimerRef.current) {
        window.clearTimeout(checkTimerRef.current);
      }
    };
  }, [paintOverlay, prizePoints]);

  const scratchAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (checkTimerRef.current) return;

    checkTimerRef.current = window.setTimeout(() => {
      checkTimerRef.current = null;
      if (awardedRef.current) return;

      const percent = scratchedPercent(ctx, canvas.width, canvas.height);
      if (percent < 0.45) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      awardedRef.current = true;
      setRevealed(true);
      onAward({ points: prizePoints, score: prizePoints, label: 'Scratch Card' });
    }, 220);
  }, [onAward, prizePoints]);

  const getCanvasPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    const point = getCanvasPoint(event);
    if (!point) return;
    isScratchingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratchAt(point.x, point.y);
  }, [getCanvasPoint, revealed, scratchAt]);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || revealed) return;
    const point = getCanvasPoint(event);
    if (!point) return;
    scratchAt(point.x, point.y);
  }, [getCanvasPoint, revealed, scratchAt]);

  const onPointerUp = useCallback(() => {
    isScratchingRef.current = false;
  }, []);

  const reset = useCallback(() => {
    setPrizePoints(randomPrize());
  }, []);

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="rounded-[32px] border border-[rgba(var(--card-border),0.9)] bg-[rgba(var(--card-surface),0.9)] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Prize
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
              {revealed ? `+${prizePoints} points` : 'Hidden reward'}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-[rgba(var(--border),0.9)] bg-white/70 px-4 py-2 text-sm font-medium text-[rgb(var(--ink))] transition-all hover:bg-white"
          >
            New card
          </button>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[28px] bg-[rgba(var(--brand-soft),0.22)]">
          <div className="flex aspect-[16/10] w-full items-center justify-center p-8 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
                Scratch card
              </p>
              <p className="mt-3 text-base font-semibold text-[rgb(var(--ink))]">
                {revealed ? 'Reward unlocked!' : 'Scratch the layer to reveal your prize.'}
              </p>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                {revealed ? 'Your points are ready to claim.' : 'Use your finger (or mouse) to scratch.'}
              </p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="absolute inset-0 h-full w-full touch-none select-none"
            style={{ opacity: revealed ? 0 : 1 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>

        {revealed ? (
          <div className="mt-6 rounded-[22px] border border-[rgba(var(--card-border),0.9)] bg-white/70 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Score
            </p>
            <p className="mt-2 text-sm font-semibold text-[rgb(var(--ink))]">
              {`+${prizePoints} points`}
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Added to your profile points.
            </p>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-xs font-medium text-[rgb(var(--muted))]">
        Tip: scratch ~half the card to unlock.
      </p>
    </div>
  );
}
