"use client";

import { Bell, ShoppingBag, ChefHat, Truck, CheckCircle, XCircle, Package } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";

const STAT_CONFIG = [
  { key: "pending", label: "New", icon: Bell, gradient: "from-orange-400 to-amber-500", shadow: "shadow-orange-500/15" },
  { key: "confirmed", label: "Confirmed", icon: ShoppingBag, gradient: "from-sky-400 to-blue-500", shadow: "shadow-sky-500/15" },
  { key: "preparing", label: "Preparing", icon: ChefHat, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/15" },
  { key: "ready", label: "Ready", icon: Package, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-500/15" },
  { key: "out_for_delivery", label: "Out", icon: Truck, gradient: "from-indigo-400 to-blue-500", shadow: "shadow-indigo-500/15" },
  { key: "completed", label: "Done", icon: CheckCircle, gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/15" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, gradient: "from-red-400 to-rose-500", shadow: "shadow-red-500/15" },
] as const;

interface OrdersStatsProps {
  orders?: DashboardOrder[];
  activeFilter?: string;
  onFilterClick?: (filter: string) => void;
}

export function OrdersStats({ orders: propOrders, activeFilter, onFilterClick }: OrdersStatsProps) {
  const orders = propOrders ?? [];

  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {STAT_CONFIG.map((s) => {
        const Icon = s.icon;
        const count = orders.filter((o) => o.status === s.key).length;
        const isActive = activeFilter === s.key;
        const clickable = !!onFilterClick;

        return (
          <button
            key={s.key}
            disabled={!clickable}
            onClick={() => onFilterClick?.(s.key)}
            className={`group relative overflow-hidden rounded-2xl border p-3 text-center transition-all duration-300 ${
              isActive
                ? "bg-white border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]"
                : "bg-white/80 border-slate-100/80 hover:bg-white hover:border-slate-200/60 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]"
            } ${clickable ? "cursor-pointer" : "cursor-default"}`}
          >
            {isActive && (
              <div className={`absolute top-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r ${s.gradient} opacity-70`} />
            )}
            <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.gradient} ${s.shadow} shadow-md text-white transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <p className="text-xl font-black text-slate-900 tabular-nums">{count}</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 mt-0.5">{s.label}</p>
          </button>
        );
      })}
    </div>
  );
}
