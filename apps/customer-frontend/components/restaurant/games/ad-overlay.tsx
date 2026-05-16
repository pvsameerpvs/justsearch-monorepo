"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type CampaignItem, FALLBACK_AD } from "./ad-overlay-fetch";
import { useAdOverlay } from "./use-ad-overlay";
import { AdOverlayHeader } from "./ad-overlay-header";
import { AdDurationTimer } from "./ad-duration-timer";
import { AdSkipButton } from "./ad-skip-button";
import { AdMediaRenderer } from "./ad-media-renderer";
import { AdInfo } from "./ad-info";

type AdOverlayProps = {
  onComplete: () => void;
  onSkip?: () => void;
  restaurantId?: string;
  gameId?: string;
  completeLabel?: string;
};

export function AdOverlay({ onComplete, onSkip, restaurantId = "mosaic-table", gameId = "1", completeLabel }: AdOverlayProps) {
  const [ads, setAds] = useState<CampaignItem[]>([FALLBACK_AD]);
  const [index, setIndex] = useState(0);
  const ad = ads[index];
  const isLast = index === ads.length - 1;

  const { done, isMuted, setIsMuted, handleComplete, handleSkip } = useAdOverlay({
    ad, gameId, restaurantId, isLast, onComplete, onSkip,
    onAdsLoaded: (active) => { if (active.length > 0) setAds(active); },
    onNextAd: () => setIndex((p) => p + 1),
  });

  if (done) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4">
        <AdOverlayHeader index={index} total={ads.length} isMuted={isMuted} onMuteToggle={() => setIsMuted((p) => !p)} onSkip={handleSkip} />
        <div className="w-full max-w-md space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
            <AdMediaRenderer mediaType={ad.mediaType} mediaUrl={ad.mediaUrl} isMuted={isMuted} onEnded={handleComplete} />
            <div className="absolute bottom-0 left-0 right-0">
              <AdDurationTimer duration={ad.duration} onComplete={handleComplete} />
            </div>
          </div>
          <AdInfo title={ad.title} companyName={ad.companyName} description={ad.description} />
          <div className="flex justify-center">
            <AdSkipButton isLastAd={isLast} onSkip={handleSkip} completeLabel={completeLabel} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
