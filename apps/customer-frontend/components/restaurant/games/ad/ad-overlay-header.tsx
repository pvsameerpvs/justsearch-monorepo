"use client";

import { X, Volume2, VolumeX } from "lucide-react";

interface AdOverlayHeaderProps {
  index: number;
  total: number;
  isMuted: boolean;
  onMuteToggle: () => void;
  onSkip: () => void;
  canSkip: boolean;
}

export function AdOverlayHeader({ index, total, isMuted, onMuteToggle, onSkip, canSkip }: AdOverlayHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
      <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
        <span className="text-xs font-bold text-white">Ad {index + 1} of {total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMuteToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        {canSkip && (
          <button
            onClick={onSkip}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
