"use client";

import type { DashboardOrder } from "@/lib/stores/order-store";
import { Bell, ShoppingBag, ChefHat, Truck, CheckCircle, XCircle } from "lucide-react";

const STAT_CONFIG = [
  { key: "pending", label: "New", icon: Bell, color: "bg-orange-50 text-orange-600 border-orange-200" },
  { key: "confirmed", label: "Confirmed", icon: ShoppingBag, color: "bg-sky-50 text-sky-600 border-sky-200" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { key: "ready", label: "Ready", icon: ShoppingBag, color: "bg-violet-50 text-violet-600 border-violet-200" },
  { key: "out_for_delivery", label: "Out", icon: Truck, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { key: "completed", label: "Done", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-50 text-red-600 border-red-200" },
] as const;

interface OrdersStatsProps {
  orders?: DashboardOrder[];
}

export function OrdersStats({ orders: propOrders }: OrdersStatsProps) {
  const orders = propOrders ?? [];

  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {STAT_CONFIG.map((s) => {
        const Icon = s.icon;
        const count = orders.filter((o) => o.status === s.key).length;
        return (
          <div key={s.key} className={`rounded-xl border p-2.5 text-center ${s.color}`}>
            <Icon className="mx-auto h-4 w-4 mb-1" />
            <p className="text-lg font-bold">{count}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
