"use client";

import { MapPin } from "lucide-react";

interface SettingsDeliveryLocationInputsProps {
  lat: number;
  lng: number;
  onLatChange: (val: number) => void;
  onLngChange: (val: number) => void;
}

export function SettingsDeliveryLocationInputs({ lat, lng, onLatChange, onLngChange }: SettingsDeliveryLocationInputsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant Location (Lat / Lng)</p>
      </div>
      <p className="text-[11px] text-slate-400">Used to calculate distance to customer address. Find your coordinates on Google Maps.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => onLatChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Longitude</label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => onLngChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          />
        </div>
      </div>
    </div>
  );
}
