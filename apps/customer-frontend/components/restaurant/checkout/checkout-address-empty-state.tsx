"use client";

import { MapPin, ChevronRight } from 'lucide-react';

export function CheckoutAddressEmptyState() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--brand))]">
        <MapPin className="h-4 w-4" />
        Choose delivery address
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </div>
  );
}
