"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdStore } from "./ad-store";
import { AdOverlayHeader } from "./ad-overlay-header";
import { AdDurationTimer } from "./ad-duration-timer";
import { AdSkipButton } from "./ad-skip-button";
import { AdMediaRenderer } from "./ad-media-renderer";
import { AdInfo } from "./ad-info";
import { AdLoadingSkeleton } from "./ad-loading-skeleton";
import { markAdShown } from "@/lib/ad-shown-tracker";
import { recordImpression } from "./ad-fetcher";
import { useAdAnalyticsStore } from "@/lib/stores/ad-analytics-store";

interface AdOverlayProps {
  onComplete: () => void;
  restaurantId?: string;
  gameId?: string;
  completeLabel?: string;
}

export function AdOverlay({ onComplete, restaurantId = "mosaic-table", gameId = "1", completeLabel }: AdOverlayProps) {
  const { ads, status, currentIndex, isMuted, advance, skipAll, setMuted, prefetch } = useAdStore();
  const ad = ads[currentIndex];
  const isLast = currentIndex >= ads.length - 1;
  const onCompleteRef = useRef(onComplete);
  const gameIdRef = useRef(gameId);
  const impressionFired = useRef(false);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    gameIdRef.current = gameId;
    if (status === 'idle') {
      prefetch(gameId, restaurantId);
    }
  }, [gameId, restaurantId, status, prefetch]);

  useEffect(() => {
    if (status === 'completed') {
      const timeout = setTimeout(onCompleteRef.current, 300);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const handleTimerEnd = useCallback(() => {
    if (impressionFired.current) return;
    impressionFired.current = true;

    if (ad?.id) {
      markAdShown(ad.id);
      recordImpression(ad.id);
      useAdAnalyticsStore.getState().recordImpression(ad.id, gameIdRef.current);
      useAdAnalyticsStore.getState().recordComplete(ad.id, gameIdRef.current);
    }
    advance();
  }, [ad?.id, advance]);

  const handleSkipAll = useCallback(() => {
    if (ad?.id) {
      skipAll(ad.id, gameIdRef.current);
    }
  }, [ad?.id, skipAll]);

  if (status === 'idle' || status === 'prefetching') {
    return <AdLoadingSkeleton />;
  }

  if (status === 'completed') return null;

  if (status === 'ready' && ads.length === 0) {
    onCompleteRef.current();
    return null;
  }

  if (!ad) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4"
      >
        <AdOverlayHeader
          index={currentIndex}
          total={ads.length}
          isMuted={isMuted}
          onMuteToggle={() => setMuted(!isMuted)}
          onSkip={handleSkipAll}
        />
        <div className="w-full max-w-md space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
            <AdMediaRenderer mediaType={ad.mediaType} mediaUrl={ad.mediaUrl} isMuted={isMuted} onEnded={handleTimerEnd} />
            <div className="absolute bottom-0 left-0 right-0">
              <AdDurationTimer duration={ad.duration} onComplete={handleTimerEnd} key={currentIndex} />
            </div>
          </div>
          <AdInfo title={ad.title} companyName={ad.companyName} description={ad.description} />
          <div className="flex justify-center">
            <AdSkipButton isLastAd={isLast} onSkip={handleSkipAll} completeLabel={completeLabel} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
