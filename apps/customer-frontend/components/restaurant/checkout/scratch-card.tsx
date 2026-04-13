"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import type { ScratchReward } from './reward-types';

type ScratchCardProps = {
  reward: ScratchReward;
  onClaim: (reward: ScratchReward) => void;
  onClose: () => void;
};

const REVEAL_THRESHOLD = 50;
const BRUSH_SIZE = 45;
const CARD_SIZE = 300;
const DPR_CAP = 2;
const SAMPLE_SIZE = 48;

function drawScratchSurface(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#e5e5e5');
  gradient.addColorStop(0.5, '#ffffff');
  gradient.addColorStop(1, '#d4d4d4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let index = 0; index < 2000; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(x, y, size, size);
  }

  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.moveTo(width * 0.53, height * 0.13);
  ctx.lineTo(width * 0.86, height * 0.12);
  ctx.lineTo(width * 0.90, height * 0.25);
  ctx.lineTo(width * 0.58, height * 0.28);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(14, width * 0.053)}px sans-serif`;
  ctx.fillText('SCRAAATCH', width * 0.58, height * 0.20);

  ctx.font = `bold ${Math.max(18, width * 0.067)}px sans-serif`;
  ctx.fillStyle = '#222';
  ctx.fillText('ME', width * 0.83, height * 0.33);

  ctx.fillStyle = '#FFB800';
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.60, width * 0.40, height * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#222';
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) * 0.01);

  const drawStar = (x: number, y: number, radius: number) => {
    ctx.beginPath();
    for (let starIndex = 0; starIndex < 5; starIndex += 1) {
      ctx.lineTo(
        Math.cos(((18 + 72 * starIndex) / 180) * Math.PI) * radius + x,
        -Math.sin(((18 + 72 * starIndex) / 180) * Math.PI) * radius + y,
      );
      ctx.lineTo(
        Math.cos(((54 + 72 * starIndex) / 180) * Math.PI) * (radius / 2) + x,
        -Math.sin(((54 + 72 * starIndex) / 180) * Math.PI) * (radius / 2) + y,
      );
    }
    ctx.closePath();
    ctx.stroke();
  };

  drawStar(width * 0.47, height * 0.40, width * 0.06);
  drawStar(width * 0.62, height * 0.34, width * 0.045);
  drawStar(width * 0.73, height * 0.44, width * 0.035);

  ctx.beginPath();
  ctx.arc(width * 0.67, height * 0.60, width * 0.13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width * 0.62, height * 0.56, width * 0.01, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.72, height * 0.56, width * 0.01, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.67, height * 0.63, width * 0.065, 0, Math.PI);
  ctx.stroke();
}

function getRewardHeadline(reward: ScratchReward) {
  return reward.kind === 'voucher' ? reward.discountLabel : `+${reward.points} POINTS`;
}

function getRewardMessage(reward: ScratchReward) {
  if (reward.kind === 'voucher') {
    return 'Tap the code to copy it.';
  }

  return 'Points added to your wallet.';
}

export function ScratchCard({ reward, onClaim, onClose }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const claimedRef = useRef(false);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const onClaimRef = useRef(onClaim);
  const copyTimeoutRef = useRef<number | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    onClaimRef.current = onClaim;
  }, [onClaim]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const rewardHeadline = useMemo(() => getRewardHeadline(reward), [reward]);
  const rewardMessage = useMemo(() => getRewardMessage(reward), [reward]);

  const revealReward = useCallback(() => {
    if (claimedRef.current) return;

    claimedRef.current = true;
    setIsScratched(true);
    onClaimRef.current(reward);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB800', '#222222', '#FFFFFF'],
      zIndex: 200000,
    });
  }, [reward]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!sampleCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.max(1, Math.round(CARD_SIZE * dpr));
    canvas.height = Math.max(1, Math.round(CARD_SIZE * dpr));
    canvas.style.width = `${CARD_SIZE}px`;
    canvas.style.height = `${CARD_SIZE}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScratchSurface(ctx, CARD_SIZE, CARD_SIZE);
    drawingRef.current = false;
    sampleCanvas.width = SAMPLE_SIZE;
    sampleCanvas.height = SAMPLE_SIZE;

    const checkReveal = () => {
      if (claimedRef.current) return;

      sampleCtx.clearRect(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      sampleCtx.drawImage(canvas, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

      const pixels = sampleCtx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
      let transparentPixels = 0;

      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] === 0) {
          transparentPixels += 1;
        }
      }

      const percentage = (transparentPixels / (pixels.length / 4)) * 100;
      if (percentage >= REVEAL_THRESHOLD) {
        revealReward();
      }
    };

    const getPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const scratch = (x: number, y: number, isStart = false) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = BRUSH_SIZE;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      if (isStart) {
        ctx.moveTo(x, y);
      } else {
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();

      lastPointRef.current = { x, y };
      checkReveal();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (claimedRef.current) return;

      drawingRef.current = true;
      if (typeof canvas.setPointerCapture === 'function') {
        canvas.setPointerCapture(event.pointerId);
      }

      const point = getPoint(event);
      scratch(point.x, point.y, true);
      event.preventDefault();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!drawingRef.current || claimedRef.current) return;

      const point = getPoint(event);
      scratch(point.x, point.y);
      event.preventDefault();
    };

    const handlePointerUp = () => {
      drawingRef.current = false;
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
  }, [revealReward]);

  const handleCopy = useCallback(async () => {
    if (reward.kind !== 'voucher') return;

    try {
      await navigator.clipboard.writeText(reward.code);
      setIsCopied(true);
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 1800);
    } catch {
      // ignore clipboard failures
    }
  }, [reward]);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        className="relative w-[300px] shadow-[0_0_60px_rgba(255,184,0,0.3)]"
      >
        <div className="flex h-[300px] w-[300px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-inner">
          <span className="text-4xl">🎉</span>
          <h3 className="mt-4 text-xl font-black tracking-tight text-slate-800">
            {rewardHeadline}
          </h3>
          <p className="mt-2 max-w-[220px] text-[12px] leading-4 text-slate-500">
            {rewardMessage}
          </p>

          {reward.kind === 'voucher' ? (
            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                className="relative cursor-pointer"
                onClick={handleCopy}
              >
                <AnimatePresence>
                  {isCopied ? (
                    <motion.div
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -40 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-x-0 -top-2 rounded bg-black px-2 py-1 text-center text-[10px] font-bold text-white"
                    >
                      COPIED! 🎉
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-6 py-2 font-mono text-[15px] font-bold tracking-[0.18em] text-amber-700 transition-all hover:scale-105 active:scale-95">
                  {reward.code}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase text-amber-600 opacity-60">
                  Tap to copy
                </div>
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                {reward.expiryLabel.toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              POINTS ADDED TO WALLET
            </div>
          )}
        </div>

        <AnimatePresence>
          {!isScratched ? (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 cursor-crosshair rounded-xl shadow-2xl touch-none"
              style={{
                clipPath:
                  'polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 10%, 95% 15%, 100% 20%, 95% 25%, 100% 30%, 95% 35%, 100% 40%, 95% 45%, 100% 50%, 95% 55%, 100% 60%, 95% 65%, 100% 70%, 95% 75%, 100% 80%, 95% 85%, 100% 90%, 95% 95%, 100% 100%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 90%, 5% 85%, 0% 80%, 5% 75%, 0% 70%, 5% 65%, 0% 60%, 5% 55%, 0% 50%, 5% 45%, 0% 40%, 5% 35%, 0% 30%, 5% 25%, 0% 20%, 5% 15%, 0% 10%, 5% 5%, 0% 0%)',
              }}
            />
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={onClose}
          className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-xl ring-1 ring-slate-200"
          aria-label="Close scratch card"
        >
          <X className="h-4 w-4 text-slate-600" />
        </button>

        <AnimatePresence>
          {!isScratched ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-10 left-0 right-0 text-center text-sm font-bold text-white/60"
            >
              Scratch to reveal your surprise!
            </motion.div>
          ) : (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 40 }}
              onClick={onClose}
              className="absolute -bottom-4 left-4 right-4 rounded-xl bg-[rgb(var(--brand))] py-4 text-sm font-black text-white shadow-[0_10px_30px_rgba(var(--brand-glow),0.4)] transition-all hover:scale-105 active:scale-95"
            >
              CLAIM & CONTINUE
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
