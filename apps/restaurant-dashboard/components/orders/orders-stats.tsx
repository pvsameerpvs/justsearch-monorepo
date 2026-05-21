"use client";

import { Bell, ShoppingBag, ChefHat, Truck, CheckCircle, XCircle, Package } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";

const STAT_CONFIG = [
  { key: "pending", label: "New", icon: Bell, color: "bg-orange-50 text-orange-600 border-orange-200", activeRing: "ring-2 ring-orange-300" },
  { key: "confirmed", label: "Confirmed", icon: ShoppingBag, color: "bg-sky-50 text-sky-600 border-sky-200", activeRing: "ring-2 ring-sky-300" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "bg-amber-50 text-amber-600 border-amber-200", activeRing: "ring-2 ring-amber-300" },
  { key: "ready", label: "Ready", icon: Package, color: "bg-violet-50 text-violet-600 border-violet-200", activeRing: "ring-2 ring-violet-300" },
  { key: "out_for_delivery", label: "Out", icon: Truck, color: "bg-indigo-50 text-indigo-600 border-indigo-200", activeRing: "ring-2 ring-indigo-300" },
  { key: "completed", label: "Done", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-200", activeRing: "ring-2 ring-emerald-300" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-50 text-red-600 border-red-200", activeRing: "ring-2 ring-red-300" },
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
            className={`rounded-xl border p-2.5 text-center transition-all ${s.color} ${isActive ? s.activeRing : ""} ${clickable ? "cursor-pointer hover:shadow-sm" : "cursor-default"}`}
          >
            <Icon className="mx-auto h-4 w-4 mb-1" />
            <p className="text-lg font-bold">{count}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider">{s.label}</p>
          </button>
        );
      })}
    </div>
  );
}
