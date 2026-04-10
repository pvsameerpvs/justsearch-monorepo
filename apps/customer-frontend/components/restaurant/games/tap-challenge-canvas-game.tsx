"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { themeRgb, themeRgba } from './canvas-theme';
import type { GameAwardHandler } from './game-award';

type TapChallengeCanvasGameProps = {
  onAward: GameAwardHandler;
};

const TAU = Math.PI * 2;
const ROUND_MS = 10_000;

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

type Ripple = {
  bornAt: number;
};

export function TapChallengeCanvasGame({ onAward }: TapChallengeCanvasGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const awardedRef = useRef(false);
  const tapsRef = useRef(0);
  const displayedTimeRef = useRef<number | null>(null);

  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS / 1000);

  const themeRef = useRef({
    brand: 'rgb(15, 118, 110)',
    accent: 'rgb(245, 170, 66)',
    ink: 'rgb(15, 23, 42)',
    muted: 'rgb(94, 108, 132)',
    background: 'rgba(15, 118, 110, 0.1)',
  });

  useEffect(() => {
    themeRef.current = {
      brand: themeRgb('--brand', '15 118 110'),
      accent: themeRgb('--accent', '245 170 66'),
      ink: themeRgb('--ink', '15 23 42'),
      muted: themeRgb('--muted', '94 108 132'),
      background: themeRgba('--brand', '15 118 110', 0.12),
    };
  }, []);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.26;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeRef.current.background;
    ctx.fillRect(0, 0, width, height);

    const startTime = startTimeRef.current;
    const running = status === 'running' && startTime !== null;
    const elapsed = running ? now - startTime : 0;
    const remaining = running ? Math.max(0, ROUND_MS - elapsed) : ROUND_MS;

    const secondsLeft = remaining / 1000;
    const displaySeconds = Number(secondsLeft.toFixed(1));
    if (displaySeconds !== displayedTimeRef.current) {
      displayedTimeRef.current = displaySeconds;
      setTimeLeft(displaySeconds);
    }

    if (running && remaining <= 0 && !awardedRef.current) {
      awardedRef.current = true;
      const score = tapsRef.current;
      const points = Math.min(score * 2, 120);
      setStatus('finished');
      onAward({ points, score, label: 'Tap Challenge' });
    }

    const ripples = ripplesRef.current.filter((ripple) => now - ripple.bornAt < 700);
    ripplesRef.current = ripples;

    ctx.save();
    ctx.strokeStyle = themeRef.current.accent;
    for (const ripple of ripples) {
      const t = Math.min((now - ripple.bornAt) / 700, 1);
      const eased = easeOutQuad(t);
      ctx.globalAlpha = (1 - eased) * 0.35;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + eased * 90, 0, TAU);
      ctx.lineWidth = 10 * (1 - eased);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, TAU);
    ctx.fillStyle = themeRef.current.brand;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '800 40px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAP', centerX, centerY);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = themeRef.current.ink;
    ctx.font = '700 28px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Taps: ${tapsRef.current}`, 28, 26);
    ctx.fillStyle = themeRef.current.muted;
    ctx.font = '600 22px ui-sans-serif, system-ui';
    ctx.fillText(`Time: ${running ? secondsLeft.toFixed(1) : status === 'finished' ? '0.0' : '10.0'}s`, 28, 62);
    ctx.restore();

    if (status === 'finished') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.font = '800 42px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Round complete!', centerX, centerY - 40);
      ctx.font = '700 28px ui-sans-serif, system-ui';
      ctx.fillText(`Score: ${tapsRef.current} taps`, centerX, centerY + 12);
      ctx.font = '700 24px ui-sans-serif, system-ui';
      ctx.fillText(`Points: +${Math.min(tapsRef.current * 2, 120)}`, centerX, centerY + 54);
      ctx.restore();
    }
  }, [onAward, status]);

  useEffect(() => {
    if (status !== 'running') {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    const loop = (now: number) => {
      draw(now);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [draw, status]);

  const onTap = useCallback(() => {
    if (status === 'finished') return;

    if (status === 'idle') {
      startTimeRef.current = performance.now();
      awardedRef.current = false;
      tapsRef.current = 0;
      ripplesRef.current = [];
      setStatus('running');
    }

    tapsRef.current += 1;
    setTaps(tapsRef.current);
    ripplesRef.current = [
      ...ripplesRef.current,
      { bornAt: performance.now() },
    ].slice(-8);
  }, [status]);

  const reset = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    ripplesRef.current = [];
    tapsRef.current = 0;
    startTimeRef.current = null;
    awardedRef.current = false;
    setTaps(0);
    setTimeLeft(ROUND_MS / 1000);
    setStatus('idle');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(performance.now());
  }, [draw]);

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <canvas
        ref={canvasRef}
        width={640}
        height={420}
        onPointerDown={onTap}
        className="h-auto w-full touch-none select-none overflow-hidden rounded-[32px] border border-[rgba(var(--card-border),0.9)] bg-white/80 shadow-sm"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onTap}
          className="inline-flex w-full items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Tap
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(var(--border),0.9)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[rgb(var(--ink))] transition-all hover:bg-white"
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-center text-xs font-medium text-[rgb(var(--muted))]">
        Score = taps in 10 seconds. Points = min(taps × 2, 120). Time left: {timeLeft}s
      </p>
    </div>
  );
}
