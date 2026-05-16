"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdAnalyticsStore } from "@/lib/stores/ad-analytics-store";
import { type CampaignItem, fetchActiveAds } from "./ad-overlay-fetch";

export function useAdOverlay({
  ad,
  gameId,
  restaurantId,
  isLast,
  onComplete,
  onSkip,
  onAdsLoaded,
  onNextAd,
}: {
  ad: CampaignItem;
  gameId: string;
  restaurantId: string;
  isLast: boolean;
  onComplete: () => void;
  onSkip?: () => void;
  onAdsLoaded: (ads: CampaignItem[]) => void;
  onNextAd: () => void;
}) {
  const [done, setDone] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { recordImpression, recordSkip, recordComplete } = useAdAnalyticsStore();

  useEffect(() => {
    fetchActiveAds(gameId, restaurantId).then(onAdsLoaded);
  }, [gameId, restaurantId, onAdsLoaded]);

  useEffect(() => {
    if (ad?.id && !ad.id.startsWith("fb")) recordImpression(ad.id, gameId);
  }, [ad?.id, gameId, recordImpression]);

  const handleComplete = useCallback(() => {
    if (ad?.id && !ad.id.startsWith("fb")) recordComplete(ad.id, gameId);
    if (isLast) { setDone(true); setTimeout(onComplete, 300); }
    else onNextAd();
  }, [isLast, onComplete, onNextAd, ad, gameId, recordComplete]);

  const handleSkip = useCallback(() => {
    if (ad?.id && !ad.id.startsWith("fb")) recordSkip(ad.id, gameId);
    if (onSkip) onSkip();
    else handleComplete();
  }, [onSkip, handleComplete, ad, gameId, recordSkip]);

  return { done, isMuted, setIsMuted, handleComplete, handleSkip };
}
