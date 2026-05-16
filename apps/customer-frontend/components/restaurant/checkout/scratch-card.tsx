"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import type { ScratchReward } from './reward-types';
import { ScratchCardReveal } from './scratch-card-reveal';
import { ScratchCardCanvas } from './scratch-card-canvas';

type ScratchCardProps = {
  reward: ScratchReward;
  onClaim: (reward: ScratchReward) => void;
  onClose: () => void;
};

export function ScratchCard({ reward, onClaim, onClose }: ScratchCardProps) {
  const claimedRef = useRef(false);
  const onClaimRef = useRef(onClaim);
  const copyTimeoutRef = useRef<number | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => { onClaimRef.current = onClaim; }, [onClaim]);
  useEffect(() => () => { if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current); }, []);

  const revealReward = useCallback(() => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    setIsScratched(true);
    onClaimRef.current(reward);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFB800', '#222222', '#FFFFFF'], zIndex: 200000 });
  }, [reward]);

  const handleCopy = useCallback(async () => {
    if (reward.kind !== 'voucher') return;
    try {
      await navigator.clipboard.writeText(reward.code);
      setIsCopied(true);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => { setIsCopied(false); copyTimeoutRef.current = null; }, 1800);
    } catch { /* ignore clipboard failures */ }
  }, [reward]);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        className="relative w-[300px] shadow-[0_0_60px_rgba(255,184,0,0.3)]"
      >
        <ScratchCardReveal reward={reward} isCopied={isCopied} onCopy={handleCopy} />
        <AnimatePresence>
          {!isScratched && <ScratchCardCanvas onReveal={revealReward} />}
        </AnimatePresence>
        <button type="button" onClick={onClose} className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-xl ring-1 ring-slate-200" aria-label="Close scratch card">
          <X className="h-4 w-4 text-slate-600" />
        </button>
        <AnimatePresence>
          {!isScratched ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute -bottom-10 left-0 right-0 text-center text-sm font-bold text-white/60">
              Scratch to reveal your surprise!
            </motion.div>
          ) : (
            <motion.button type="button" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 40 }} onClick={onClose} className="absolute -bottom-4 left-4 right-4 rounded-xl bg-[rgb(var(--brand))] py-4 text-sm font-black text-white shadow-[0_10px_30px_rgba(var(--brand-glow),0.4)] transition-all hover:scale-105 active:scale-95">
              CLAIM & CONTINUE
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
