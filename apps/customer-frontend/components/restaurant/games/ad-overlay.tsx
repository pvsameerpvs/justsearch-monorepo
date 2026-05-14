"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import { useAdAnalyticsStore } from "@/lib/stores/ad-analytics-store";
import { AdDurationTimer } from "./ad-duration-timer";
import { AdSkipButton } from "./ad-skip-button";
import { AdMediaRenderer } from "./ad-media-renderer";
import { AdInfo } from "./ad-info";

interface CampaignItem {
  id: string; isActive: boolean; assignedGames: string[]; type: string;
  restaurantId: string | null; title: string; companyName: string;
  mediaType: string; mediaUrl: string; duration: number; description?: string;
}

function readCampaigns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("ad-campaign-store");
    if (!raw) return [];
    return JSON.parse(raw).state?.campaigns ?? [];
  } catch { return []; }
}

type AdOverlayProps = {
  onComplete: () => void;
  onSkip?: () => void;
  restaurantId?: string;
  gameId?: string;
  completeLabel?: string;
};

export function AdOverlay({ onComplete, onSkip, restaurantId = "mosaic-table", gameId = "1", completeLabel }: AdOverlayProps) {
  const campaigns = readCampaigns();
  const eligible = campaigns.filter((c: CampaignItem) =>
    c.isActive && c.assignedGames.includes(gameId) && (c.type === "platform" || c.restaurantId === restaurantId)
  );

  const fallback = [{ id: "fb-1", title: "Special Offer", description: "Get 20% off!", mediaUrl: "🍽️", mediaType: "image", duration: 5000, companyName: "Restaurant" }];
  const ads = eligible.length > 0 ? eligible : fallback;
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [done, setDone] = useState(false);
  const { recordImpression, recordSkip, recordComplete } = useAdAnalyticsStore();
  const ad = ads[index];
  const isLast = index === ads.length - 1;

  useEffect(() => { if (ad?.id && !ad.id.startsWith("fallback")) recordImpression(ad.id, gameId); }, [index, ad?.id, gameId, recordImpression]);

  const handleComplete = useCallback(() => {
    if (ad?.id && !ad.id.startsWith("fb")) recordComplete(ad.id, gameId);
    if (isLast) { setDone(true); setTimeout(onComplete, 300); }
    else setIndex((p) => p + 1);
  }, [isLast, onComplete, ad, gameId, recordComplete]);

  const handleSkip = useCallback(() => {
    if (ad?.id && !ad.id.startsWith("fb")) recordSkip(ad.id, gameId);
    if (onSkip) onSkip();
    else handleComplete();
  }, [onSkip, handleComplete, ad, gameId, recordSkip]);

  if (done) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4">
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md"><span className="text-xs font-bold text-white">Ad {index + 1} of {ads.length}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20">{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
            <button onClick={handleSkip} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
            <AdMediaRenderer mediaType={ad.mediaType} mediaUrl={ad.mediaUrl} isMuted={isMuted} onEnded={handleComplete} />
            <div className="absolute bottom-0 left-0 right-0"><AdDurationTimer duration={ad.duration} onComplete={handleComplete} /></div>
          </div>
          <AdInfo title={ad.title} companyName={ad.companyName} description={ad.description} />
          <div className="flex justify-center"><AdSkipButton isLastAd={isLast} onSkip={handleSkip} completeLabel={completeLabel} /></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
