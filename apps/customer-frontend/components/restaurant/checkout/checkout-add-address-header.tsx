"use client";

import { Loader2, MapPin } from 'lucide-react';

type CheckoutAddAddressHeaderProps = {
  isLocating: boolean;
  onGetCurrentLocation: () => void;
};

export function CheckoutAddAddressHeader({ isLocating, onGetCurrentLocation }: CheckoutAddAddressHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">Add delivery address</p>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">Save a new address for checkout and profile.</p>
      </div>
      <button
        type="button"
        onClick={onGetCurrentLocation}
        disabled={isLocating}
        className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand-soft)/0.34)] px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.5)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        {isLocating ? 'Locating...' : 'Use current location'}
      </button>
    </div>
  );
}
