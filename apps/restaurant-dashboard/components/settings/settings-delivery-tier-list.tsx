"use client";

import type { DeliveryTier } from "@justsearch/types";
import { Plus, AlertTriangle, Check, Info } from "lucide-react";
import { SettingsDeliveryTierCard } from "./settings-delivery-tier-card";
import { useDeliveryTierValidation } from "./use-delivery-tier-validation";

interface SettingsDeliveryTierListProps {
  tiers: DeliveryTier[];
  maxRadiusKm: number;
  onUpdate: (index: number, field: 'minKm' | 'maxKm' | 'fee', value: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function SettingsDeliveryTierList({ tiers, maxRadiusKm, onUpdate, onAdd, onRemove }: SettingsDeliveryTierListProps) {
  const tierGaps = useDeliveryTierValidation(tiers, maxRadiusKm);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pricing Tiers</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add tier
        </button>
      </div>
      <p className="text-[11px] text-slate-400">
        Create distance brackets. Each tier covers customers within its min-max km range. Make sure tiers cover 0 to your max radius.
      </p>

      <div className="space-y-2">
        {tiers.map((tier, i) => (
          <SettingsDeliveryTierCard
            key={i}
            tier={tier}
            index={i}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>

      {tierGaps.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700">Tier gaps detected</p>
              <ul className="mt-1 space-y-0.5">
                {tierGaps.map((gap, i) => (
                  <li key={i} className="text-[11px] text-amber-600">• {gap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {tierGaps.length === 0 && tiers.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          Tiers fully cover 0 – {maxRadiusKm} km
        </div>
      )}
    </div>
  );
}
