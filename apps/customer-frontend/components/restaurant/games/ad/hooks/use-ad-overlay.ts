"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAdStore } from "../ad-store";
import { markAdShown } from "@/lib/ad-shown-tracker";
import { recordImpression } from "../ad-fetcher";
import { useAdAnalyticsStore } from "@/lib/stores/ad-analytics-store";
import { useImmersiveMode } from "@/lib/stores/chrome-store";
import { useCanSkip } from "./use-can-skip";

interface UseAdOverlayProps {
  onComplete: () => void;
  gameId: string;
  restaurantId: string;
  skipDelay?: number;
}

export function useAdOverlay({ onComplete, gameId, restaurantId, skipDelay = 4000 }: UseAdOverlayProps) {
  const { ads, status, currentIndex, isMuted, advance, skipAll, setMuted, prefetch } = useAdStore();
  const ad = ads[currentIndex];
  const isLast = currentIndex >= ads.length - 1;

  useImmersiveMode();
  const { canSkip, remaining } = useCanSkip(skipDelay, currentIndex);

  // Keep latest onComplete in a ref so it never triggers duplicate effect runs
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (status === "idle") {
      prefetch(gameId, restaurantId);
    }
  }, [gameId, restaurantId, status, prefetch]);

  useEffect(() => {
    if (status === "completed") {
      const timeout = setTimeout(() => onCompleteRef.current(), 300);
      return () => clearTimeout(timeout);
    }
    if (status === "ready" && ads.length === 0) {
      onCompleteRef.current();
    }
  }, [status, ads.length]);

  // Reset impression tracker for every new ad
  const impressionFired = useRef(false);
  useEffect(() => {
    impressionFired.current = false;
  }, [currentIndex]);

  const handleTimerEnd = useCallback(() => {
    if (impressionFired.current) return;
    impressionFired.current = true;

    if (ad?.id) {
      markAdShown(ad.id);
      recordImpression(ad.id);
      useAdAnalyticsStore.getState().recordImpression(ad.id, gameId);
      useAdAnalyticsStore.getState().recordComplete(ad.id, gameId);
    }
    advance();
  }, [ad?.id, advance, gameId]);

  const handleSkipAll = useCallback(() => {
    if (ad?.id) {
      skipAll(ad.id, gameId);
    }
  }, [ad?.id, skipAll, gameId]);

  return {
    ad,
    ads,
    status,
    currentIndex,
    isMuted,
    isLast,
    setMuted,
    canSkip,
    remaining,
    handleTimerEnd,
    handleSkipAll,
  };
}
