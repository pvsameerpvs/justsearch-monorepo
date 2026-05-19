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

  // --- CLICK TRACKING ---
  const pendingClickEventId = useRef<string | null>(null);
  const clickConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Abandon pending click helper (must be defined before handleSkipAll)
  const abandonPendingClick = useCallback(() => {
    if (clickConfirmTimer.current) {
      clearTimeout(clickConfirmTimer.current);
      clickConfirmTimer.current = null;
    }
    const stored = pendingClickEventId.current;
    if (stored) {
      const [storedAdId, eventId] = stored.split('|');
      if (storedAdId && eventId) abandonAdClick(storedAdId, eventId);
      pendingClickEventId.current = null;
    }
  }, []);

  // Cleanup orphaned clicks when ad changes or unmounts
  useEffect(() => {
    return () => {
      if (clickConfirmTimer.current) {
        clearTimeout(clickConfirmTimer.current);
        clickConfirmTimer.current = null;
      }
      if (pendingClickEventId.current) {
        const stored = pendingClickEventId.current;
        pendingClickEventId.current = null;
        if (stored) {
          const [storedAdId, eventId] = stored.split('|');
          if (storedAdId && eventId) abandonAdClick(storedAdId, eventId);
        }
      }
    };
  }, [currentIndex]);

  const handleLinkClick = useCallback(async () => {
    if (!ad?.id || pendingClickEventId.current) return;

    const eventId = await trackAdEvent(ad.id, 'click_pending');
    if (!eventId) return;

    // Store combined so cleanup has correct adId even after ad changes
    pendingClickEventId.current = `${ad.id}|${eventId}`;

    clickConfirmTimer.current = setTimeout(() => {
      const stored = pendingClickEventId.current;
      if (stored) {
        const [, storedEventId] = stored.split('|');
        if (storedEventId) confirmAdClick(ad.id, storedEventId);
        pendingClickEventId.current = null;
        clickConfirmTimer.current = null;
      }
    }, 3000);
  }, [ad?.id]);

  // Skip / early exit
  const handleSkipAll = useCallback(() => {
    abandonPendingClick();
    if (ad?.id) {
      if (view3sReached.current && !fullViewTracked.current) {
        // Skipped after 3s but before full view → charge 3s view cost
        trackAdEvent(ad.id, 'view_3s');
      } else if (!view3sReached.current && !fullViewTracked.current) {
        // Skipped before 3s → no charge, but track for analytics
        trackAdEvent(ad.id, 'skip');
      }
      skipAll(ad.id, gameId);
    }
  }, [abandonPendingClick, ad?.id, skipAll, gameId]);

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
