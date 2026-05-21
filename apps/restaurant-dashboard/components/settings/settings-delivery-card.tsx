"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";
import { UAE_EMIRATES } from "@justsearch/types";
import type { DeliveryConfig } from "@justsearch/types";
import { SettingsDeliveryForm } from "./settings-delivery-form";
import { SettingsDeliveryCardView } from "./settings-delivery-card-view";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

function buildDefaultConfig(): DeliveryConfig {
  return {
    enabled: false,
    maxRadiusKm: 3,
    restaurantLat: 0,
    restaurantLng: 0,
    emirates: [...UAE_EMIRATES],
    tiers: [{ minKm: 0, maxKm: 1, fee: 5 }],
  };
}

export function SettingsDeliveryCard({ restaurant, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<DeliveryConfig>(restaurant.delivery ?? buildDefaultConfig());

  const handleSave = () => {
    onUpdate?.({ delivery: config });
    setIsEditing(false);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Truck className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delivery Settings</h3>
            <p className="text-[11px] text-slate-500">Configure radius, pricing tiers & location</p>
          </div>
        </div>
        {isEditing ? (
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">Cancel</button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Save</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">Edit</button>
        )}
      </div>
      {isEditing ? (
        <SettingsDeliveryForm config={config} onChange={setConfig} />
      ) : (
        <SettingsDeliveryCardView delivery={restaurant.delivery} />
      )}
    </div>
  );
}
