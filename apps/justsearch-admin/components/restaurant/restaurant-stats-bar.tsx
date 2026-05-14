"use client";

import { Building2, CheckCircle2 } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

interface RestaurantStatsBarProps {
  restaurants: AdminRestaurant[];
}

export function RestaurantStatsBar({ restaurants }: RestaurantStatsBarProps) {
  const total = restaurants.length;
  const active = restaurants.filter((r) => r.status === "active").length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Total" value={total} icon={Building2} color="slate" />
      <StatCard label="Active" value={active} icon={CheckCircle2} color="emerald" />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
  };

  return (
    <div className={`rounded-xl border p-3 flex items-center gap-3 ${colors[color]}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      </div>
    </div>
  );
}
