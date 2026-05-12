"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { AdTimer } from './ad-timer';
import { AdSkipButton } from './ad-skip-button';

const DEMO_ADS = [
  {
    id: 'ad1',
    title: 'Mosaic Table Special',
    description: 'Get 20% off your first order! Limited time offer.',
    image: '🍽️',
    duration: 5000,
    sponsor: 'restaurant',
  },
  {
    id: 'ad2',
    title: 'JustSearch Premium',
    description: 'Upgrade to Exclusive Plan and unlock all 5 games + VIP tiers.',
    image: '⭐',
    duration: 5000,
    sponsor: 'justsearch',
  },
  {
    id: 'ad3',
    title: 'New: Slice Master',
    description: 'Swipe to slice fruits! New game available now.',
    image: '🍕',
    duration: 4000,
    sponsor: 'restaurant',
  },
];

type AdOverlayProps = {
  onComplete: () => void;
  onSkip?: () => void;
};

export function AdOverlay({ onComplete, onSkip }: AdOverlayProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const currentAd = DEMO_ADS[currentAdIndex];
  const isLastAd = currentAdIndex >= DEMO_ADS.length - 1;

  useEffect(() => {
    if (!isVisible) return;

    const duration = currentAd.duration;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          if (isLastAd) {
            onComplete();
            return 100;
          } else {
            setCurrentAdIndex((i) => i + 1);
            return 0;
          }
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentAd, currentAdIndex, isLastAd, isVisible, onComplete]);

  const handleSkip = useCallback(() => {
    if (isLastAd) {
      onComplete();
    } else {
      setCurrentAdIndex((i) => i + 1);
      setProgress(0);
    }
  }, [isLastAd, onComplete]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onSkip?.();
  }, [onSkip]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 p-4"
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <AdTimer progress={progress} />

          {/* Controls */}
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Ad content */}
          <div className="p-8 pt-10 text-center">
            <div className="text-6xl">{currentAd.image}</div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{currentAd.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{currentAd.description}</p>

            <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              Sponsored by {currentAd.sponsor === 'justsearch' ? 'JustSearch' : 'Restaurant'}
            </div>
          </div>

          <AdSkipButton isLastAd={isLastAd} onSkip={handleSkip} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
