"use client";

import { Leaf, Beef } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface SettingsDietaryCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsDietaryCard({ restaurant, onUpdate }: SettingsDietaryCardProps) {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Leaf className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Dietary Preferences</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">Pure Veg Restaurant</p>
            <p className="text-xs text-slate-500">
              When enabled, your menu will show a &quot;Pure Veg&quot; badge to customers and all items default to vegetarian.
            </p>
          </div>
          <button
            onClick={() => onUpdate?.({ isPureVeg: !restaurant.isPureVeg })}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              restaurant.isPureVeg ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                restaurant.isPureVeg ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-emerald-50/50 p-3">
          <Leaf className="h-4 w-4 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-800">
            {restaurant.isPureVeg
              ? "Your restaurant is marked as Pure Veg. Customers will see only vegetarian options."
              : "Your restaurant serves both veg and non-veg. Customers can filter by dietary preference."}
          </p>
        </div>
      </div>
    </div>
  );
}
