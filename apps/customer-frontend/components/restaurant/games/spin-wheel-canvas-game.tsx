"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { themeRgb, themeRgba } from './canvas-theme';
import type { GameAwardHandler } from './game-award';

type SpinWheelCanvasGameProps = {
  onAward: GameAwardHandler;
};

const TAU = Math.PI * 2;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function SpinWheelCanvasGame({ onAward }: SpinWheelCanvasGameProps) {
  const segments = useMemo(() => [10, 20, 30, 50, 80, 100, 120], []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const themeRef = useRef({
    brand: 'rgb(15, 118, 110)',
    accent: 'rgb(245, 170, 66)',
    ink: 'rgb(15, 23, 42)',
    muted: 'rgb(94, 108, 132)',
    surface: 'rgb(255, 255, 255)',
    border: 'rgba(226, 232, 240, 0.9)',
    segmentA: 'rgba(15, 118, 110, 0.22)',
    segmentB: 'rgba(245, 170, 66, 0.22)',
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [resultPoints, setResultPoints] = useState<number | null>(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const segmentAngle = TAU / segments.length;
    const pointerAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
    ctx.shadowBlur = 26;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, TAU);
    ctx.fillStyle = themeRef.current.surface;
    ctx.fill();
    ctx.restore();

    for (let index = 0; index < segments.length; index += 1) {
      const startAngle = rotationRef.current + index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = index % 2 === 0 ? themeRef.current.segmentA : themeRef.current.segmentB;
      ctx.fill();

      ctx.strokeStyle = themeRef.current.border;
      ctx.lineWidth = 5;
      ctx.stroke();

      const labelAngle = startAngle + segmentAngle / 2;
      const labelRadius = radius * 0.68;
      const x = centerX + Math.cos(labelAngle) * labelRadius;
      const y = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(labelAngle + Math.PI / 2);
      ctx.fillStyle = themeRef.current.ink;
      ctx.font = '700 32px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${segments[index]} pts`, 0, 0);
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.22, 0, TAU);
    ctx.fillStyle = themeRef.current.surface;
    ctx.fill();
    ctx.strokeStyle = themeRef.current.border;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);
    const pointerRadius = radius + 22;
    const pointerX = Math.cos(pointerAngle) * pointerRadius;
    const pointerY = Math.sin(pointerAngle) * pointerRadius;
    ctx.beginPath();
    ctx.moveTo(pointerX, pointerY);
    ctx.lineTo(pointerX - 20, pointerY + 42);
    ctx.lineTo(pointerX + 20, pointerY + 42);
    ctx.closePath();
    ctx.fillStyle = themeRef.current.brand;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = themeRef.current.muted;
    ctx.font = '600 20px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tap Spin to play', centerX, centerY + radius * 0.33);
    ctx.restore();
  }, [segments]);

  useEffect(() => {
    mountedRef.current = true;
    themeRef.current = {
      brand: themeRgb('--brand', '15 118 110'),
      accent: themeRgb('--accent', '245 170 66'),
      ink: themeRgb('--ink', '15 23 42'),
      muted: themeRgb('--muted', '94 108 132'),
      surface: themeRgb('--surface', '255 255 255'),
      border: themeRgba('--border', '226 232 240', 0.9),
      segmentA: themeRgba('--brand', '15 118 110', 0.22),
      segmentB: themeRgba('--accent', '245 170 66', 0.22),
    };

    drawWheel();

    return () => {
      mountedRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResultPoints(null);

    const targetIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = TAU / segments.length;
    const pointerAngle = -Math.PI / 2;
    const targetCenter = targetIndex * segmentAngle + segmentAngle / 2;
    const desiredRotationMod = pointerAngle - targetCenter;

    const currentRotation = rotationRef.current;
    const currentMod = ((currentRotation % TAU) + TAU) % TAU;
    const desiredMod = ((desiredRotationMod % TAU) + TAU) % TAU;

    let delta = desiredMod - currentMod;
    if (delta < 0) delta += TAU;

    const extraTurns = TAU * (5 + Math.floor(Math.random() * 3));
    const finalRotation = currentRotation + extraTurns + delta;

    const durationMs = 2800;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);

      rotationRef.current = currentRotation + (finalRotation - currentRotation) * eased;
      drawWheel();

      if (!mountedRef.current) return;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const points = segments[targetIndex] ?? 0;
      setIsSpinning(false);
      setResultPoints(points);
      onAward({ points, score: points, label: 'Spin the Wheel' });
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [drawWheel, isSpinning, onAward, segments]);

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="h-auto w-full select-none rounded-[28px] border border-[rgba(var(--border),0.8)] bg-white/70 shadow-sm"
      />

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning}
          className="inline-flex w-full items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSpinning ? 'Spinning…' : 'Spin'}
        </button>

        {resultPoints !== null ? (
          <div className="rounded-[22px] border border-[rgba(var(--card-border),0.9)] bg-[rgba(var(--card-surface),0.84)] p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Result
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
              +{resultPoints} points
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
