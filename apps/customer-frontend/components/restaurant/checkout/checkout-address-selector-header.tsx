"use client";

import { X } from 'lucide-react';

export function CheckoutAddressSelectorHeader({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[rgb(var(--ink))]">
      <X className="h-5 w-5" />
    </button>
  );
}
