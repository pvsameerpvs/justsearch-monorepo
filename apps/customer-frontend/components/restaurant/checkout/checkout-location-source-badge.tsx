"use client";

import { MapPin, LocateFixed, Crosshair } from 'lucide-react';

interface CheckoutLocationSourceBadgeProps {
  source?: 'saved' | 'gps' | 'pinned' | 'none';
}

export function CheckoutLocationSourceBadge({ source }: CheckoutLocationSourceBadgeProps) {
  if (source === 'gps') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600"><LocateFixed className="h-3 w-3" /> GPS</span>;
  }
  if (source === 'pinned') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600"><Crosshair className="h-3 w-3" /> Map Pin</span>;
  }
  if (source === 'saved') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600"><MapPin className="h-3 w-3" /> Saved</span>;
  }
  return null;
}
