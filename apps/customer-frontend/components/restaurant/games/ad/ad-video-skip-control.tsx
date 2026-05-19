"use client";

interface AdVideoSkipControlProps {
  canSkip: boolean;
  remainingSeconds: number;
  isLastAd: boolean;
  onSkip: () => void;
  completeLabel?: string;
}

/**
 * Google Ads style skip button.
 * Small, sits bottom-right inside the video player.
 * During countdown: "Skip ad in 4"
 * After countdown: "Skip ad" (clickable)
 */
export function AdVideoSkipControl({ canSkip, remainingSeconds, isLastAd, onSkip, completeLabel = "Continue" }: AdVideoSkipControlProps) {
  if (!canSkip) {
    return (
      <div className="absolute bottom-3 right-3 z-20 rounded-sm bg-black/60 px-2.5 py-1 text-xs font-medium text-white/90">
        Skip ad in {remainingSeconds}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSkip}
      className="absolute bottom-3 right-3 z-20 rounded-sm bg-black/60 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-black/80"
    >
      {isLastAd ? completeLabel : "Skip ad"}
    </button>
  );
}
