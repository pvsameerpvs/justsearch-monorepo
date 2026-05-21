"use client";

import type { DeliveryTier } from "@justsearch/types";
import { Trash2 } from "lucide-react";

interface SettingsDeliveryTierCardProps {
  tier: DeliveryTier;
  index: number;
  onUpdate: (index: number, field: 'minKm' | 'maxKm' | 'fee', value: number) => void;
  onRemove: (index: number) => void;
}

export function SettingsDeliveryTierCard({ tier, index, onUpdate, onRemove }: SettingsDeliveryTierCardProps) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:border-amber-200 transition-colors">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xs font-black text-amber-700">
        {index + 1}
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1">
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase text-slate-400">From (km)</label>
          <input
            type="number"
            step="0.1"
            value={tier.minKm}
            onChange={(e) => onUpdate(index, 'minKm', parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-amber-500"
          />
        </div>
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase text-slate-400">To (km)</label>
          <input
            type="number"
            step="0.1"
            value={tier.maxKm}
            onChange={(e) => onUpdate(index, 'maxKm', parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-amber-500"
          />
        </div>
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase text-slate-400">Fee (AED)</label>
          <input
            type="number"
            step="0.01"
            value={tier.fee}
            onChange={(e) => onUpdate(index, 'fee', parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-amber-500"
          />
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
        title="Remove tier"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
