"use client";

import { useState } from "react";
import { Armchair, Minus, Plus } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface SettingsTablesCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsTablesCard({ restaurant, onUpdate }: SettingsTablesCardProps) {
  const [count, setCount] = useState(restaurant.tables);

  const handleSave = () => {
    if (count !== restaurant.tables) onUpdate?.({ tables: count });
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
          <Armchair className="h-5 w-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Table Count</h3>
          <p className="text-[11px] text-slate-500">Number of dine-in tables</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setCount((c) => Math.max(1, c - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-2xl font-bold text-slate-900 w-12 text-center">{count}</span>
        <button onClick={() => setCount((c) => c + 1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {count !== restaurant.tables && (
        <button onClick={handleSave} className="mt-4 elegant-btn-primary w-full text-sm">Save Table Count</button>
      )}
    </div>
  );
}
