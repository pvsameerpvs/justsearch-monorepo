"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { setupCanvas, doScratch, checkRevealThreshold } from './scratch-card-canvas-logic';
import { REVEAL_THRESHOLD, SAMPLE_SIZE } from './scratch-card-types';

export function ScratchCardCanvas({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const claimedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!sampleCtx) return;
    setupCanvas(canvas, ctx);
    sampleCanvas.width = SAMPLE_SIZE;
    sampleCanvas.height = SAMPLE_SIZE;
    drawingRef.current = false;
    const checkReveal = () => {
      if (claimedRef.current) return;
      if (checkRevealThreshold(canvas, sampleCtx, SAMPLE_SIZE) >= REVEAL_THRESHOLD) {
        claimedRef.current = true;
        onReveal();
      }
    };
    const scratch = (x: number, y: number, isStart = false) => {
      doScratch(ctx, lastPointRef.current, x, y, isStart);
      lastPointRef.current = { x, y };
      checkReveal();
    };
    const onDown = (e: PointerEvent) => {
      if (claimedRef.current) return;
      drawingRef.current = true;
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
      const r = canvas.getBoundingClientRect();
      scratch(e.clientX - r.left, e.clientY - r.top, true);
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current || claimedRef.current) return;
      const r = canvas.getBoundingClientRect();
      scratch(e.clientX - r.left, e.clientY - r.top);
      e.preventDefault();
    };
    const onUp = () => { drawingRef.current = false; };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, [onReveal]);

  return (
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
  );
}
