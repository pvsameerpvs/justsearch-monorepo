"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AdOverlayHeader } from "./ad-overlay-header";
import { AdDurationTimer } from "./ad-duration-timer";
import { AdVideoSkipControl } from "./ad-video-skip-control";
import { AdMediaRenderer } from "./ad-media-renderer";
import { AdInfo } from "./ad-info";
import { useAdOverlay } from "./hooks/use-ad-overlay";

interface AdOverlayProps {
  onComplete: () => void;
  restaurantId?: string;
  gameId?: string;
  completeLabel?: string;
}

export function AdOverlay({ onComplete, restaurantId = "mosaic-table", gameId = "1", completeLabel }: AdOverlayProps) {
  const { ad, ads, status, currentIndex, isMuted, isLast, setMuted, canSkip, remaining, handleTimerEnd, handleSkipAll, handleLinkClick } =
    useAdOverlay({ onComplete, gameId, restaurantId });

  if (status === "idle" || status === "prefetching") {
    return <div className="fixed inset-0 z-[10001] bg-black" />;
  }
  if (status === "ready" && ads.length === 0) return null;

  const showOverlay = status !== "completed" && !!ad;

  return (
    <AnimatePresence mode="wait">
      {showOverlay && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-black/90 p-4"
        >
          <AdOverlayHeader
            index={currentIndex}
            total={ads.length}
            isMuted={isMuted}
            onMuteToggle={() => setMuted(!isMuted)}
            onSkip={handleSkipAll}
            canSkip={canSkip}
          />
          <div className="w-full max-w-md space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
              <AdMediaRenderer
                mediaType={ad.mediaType}
                mediaUrl={ad.mediaUrl}
                mediaUrlLow={ad.mediaUrlLow}
                linkUrl={ad.linkUrl}
                isMuted={isMuted}
                onEnded={handleTimerEnd}
                onLinkClick={handleLinkClick}
              />
              <div className="absolute bottom-0 left-0 right-0">
                <AdDurationTimer duration={ad.duration} onComplete={handleTimerEnd} key={currentIndex} />
              </div>
              <AdVideoSkipControl
                canSkip={canSkip}
                remainingSeconds={remaining}
                isLastAd={isLast}
                onSkip={handleSkipAll}
                completeLabel={completeLabel}
              />
            </div>
            <AdInfo title={ad.title} linkUrl={ad.linkUrl} description={ad.description} visibility={ad.visibility} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
