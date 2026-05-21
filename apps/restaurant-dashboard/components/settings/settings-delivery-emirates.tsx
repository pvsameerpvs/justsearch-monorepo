"use client";

import type { UaeEmirate } from "@justsearch/types";
import { UAE_EMIRATES } from "@justsearch/types";
import { MapPin } from "lucide-react";

interface SettingsDeliveryEmiratesProps {
  selected: UaeEmirate[];
  onToggle: (emirate: UaeEmirate) => void;
}

export function SettingsDeliveryEmirates({ selected, onToggle }: SettingsDeliveryEmiratesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Deliver to Emirates</p>
      </div>
      <p className="text-[11px] text-slate-400">Select which UAE emirates this restaurant delivers to. Orders outside selected emirates will be rejected.</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {UAE_EMIRATES.map((emirate) => {
          const checked = selected.includes(emirate);
          return (
            <label
              key={emirate}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                checked
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(emirate)}
                className="h-4 w-4 accent-emerald-500"
              />
              {emirate}
            </label>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs font-bold text-red-500">Select at least one emirate</p>
      )}
    </div>
  );
}
