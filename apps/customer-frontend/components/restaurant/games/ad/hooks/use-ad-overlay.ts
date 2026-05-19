"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAdStore } from "../ad-store";
import { markAdShown } from "@/lib/ad-shown-tracker";
import { trackAdEvent, confirmAdClick, abandonAdClick } from "../ad-fetcher";
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

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Prefetch ads on mount
  useEffect(() => {
    if (status === "idle") prefetch(gameId, restaurantId);
  }, [gameId, restaurantId, status, prefetch]);

  // Call onComplete when all ads finished
  useEffect(() => {
    if (status === "completed") {
      const timeout = setTimeout(() => onCompleteRef.current(), 300);
      return () => clearTimeout(timeout);
    }
    if (status === "ready" && ads.length === 0) onCompleteRef.current();
  }, [status, ads.length]);

  // --- BILLING STATE ---
  // 3s milestone: reached but NOT charged yet. Charged only if skipped before full.
  const view3sReached = useRef(false);
  const fullViewTracked = useRef(false);

  useEffect(() => {
    view3sReached.current = false;
    fullViewTracked.current = false;
  }, [currentIndex]);

  // 3-second milestone: mark reached but do NOT bill yet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ad?.id) view3sReached.current = true;
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, ad?.id]);

  // Full view complete: bill ONLY fullViewCost (highest tier, no double charge)
  const handleTimerEnd = useCallback(() => {
    if (fullViewTracked.current) return;
    fullViewTracked.current = true;

    if (ad?.id) {
      view3sReached.current = true; // full implies 3s
      trackAdEvent(ad.id, 'view_full');
      markAdShown(ad.id);
      useAdAnalyticsStore.getState().recordImpression(ad.id, gameId);
      useAdAnalyticsStore.getState().recordComplete(ad.id, gameId);
    }
    advance();
  }, [ad?.id, advance, gameId]);

  // Skip / early exit: if 3s reached but full didn't → bill 3sCost only
  const handleSkipAll = useCallback(() => {
    if (ad?.id) {
      if (view3sReached.current && !fullViewTracked.current) {
        trackAdEvent(ad.id, 'view_3s');
      }
      skipAll(ad.id, gameId);
    }
  }, [ad?.id, skipAll, gameId]);

  // --- CLICK TRACKING ---
  const pendingClickEventId = useRef<string | null>(null);
  const clickConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pendingClickEventId.current = null;
    if (clickConfirmTimer.current) {
      clearTimeout(clickConfirmTimer.current);
      clickConfirmTimer.current = null;
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (clickConfirmTimer.current) clearTimeout(clickConfirmTimer.current);
      if (pendingClickEventId.current && ad?.id) {
        abandonAdClick(ad.id, pendingClickEventId.current);
        pendingClickEventId.current = null;
      }
    };
  }, [ad?.id]);

  const handleLinkClick = useCallback(async () => {
    if (!ad?.id || pendingClickEventId.current) return;

    const eventId = await trackAdEvent(ad.id, 'click_pending');
    if (!eventId) return;

    pendingClickEventId.current = eventId;

    clickConfirmTimer.current = setTimeout(() => {
      if (pendingClickEventId.current) {
        confirmAdClick(ad.id, pendingClickEventId.current);
        pendingClickEventId.current = null;
        clickConfirmTimer.current = null;
      }
    }, 3000);
  }, [ad?.id]);

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
    handleLinkClick,
  };
}
