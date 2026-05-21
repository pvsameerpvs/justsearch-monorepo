"use client";

import { Navigation } from "lucide-react";

interface SettingsDeliveryRadiusInputProps {
  value: number;
  onChange: (val: number) => void;
}

export function SettingsDeliveryRadiusInput({ value, onChange }: SettingsDeliveryRadiusInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Navigation className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Maximum Delivery Radius</p>
      </div>
      <p className="text-[11px] text-slate-400">Orders from addresses beyond this distance will be automatically rejected.</p>
      <div className="flex items-center gap-3">
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="50"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 1)}
          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
        />
        <span className="text-sm font-bold text-slate-600">kilometers</span>
      </div>
    </div>
  );
}
