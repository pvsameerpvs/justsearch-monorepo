"use client";

import { Loader2, MapPin } from "lucide-react";

interface AddressSelectorHeaderProps {
  isLocating: boolean;
  onUseCurrentLocation: () => void;
  onOpenMapChooser: () => void;
}

export function AddressSelectorHeader({ isLocating, onUseCurrentLocation, onOpenMapChooser }: AddressSelectorHeaderProps) {
  return (
    <div className="mb-4">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">Select delivery address</p>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Use one of the saved addresses from your profile.</p>

      <button
        type="button"
        onClick={onUseCurrentLocation}
        disabled={isLocating}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand-soft)/0.34)] px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.5)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        {isLocating ? 'Locating...' : 'Use current location'}
      </button>

      <button
        type="button"
        onClick={onOpenMapChooser}
        className="ml-2 mt-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--brand)/0.3)] bg-white px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.2)]"
      >
        <MapPin className="h-4 w-4" />
        Choose location on map
      </button>

      <p className="mt-2 text-[12px] font-medium text-[rgb(var(--muted))]">
        If location is different from your saved addresses, we will open map choose mode.
      </p>
    </div>
  );
}
