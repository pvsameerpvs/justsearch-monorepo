"use client";

import { Flame, TrendingUp } from "lucide-react";

const ITEMS = [
  { name: "Whipped Hummus", orders: 42, change: "+15%", icon: "🥗" },
  { name: "Citrus Grilled Salmon", orders: 38, change: "+8%", icon: "🐟" },
  { name: "Charred Halloumi", orders: 35, change: "+22%", icon: "🧀" },
  { name: "Date Cake", orders: 28, change: "+12%", icon: "🍰" },
];

export function TopMenuItems() {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Top Menu Items</h3>
          <p className="text-sm text-slate-500">Most ordered today</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {ITEMS.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-lg border border-slate-50 bg-slate-50/30 p-3">
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.orders} orders</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
