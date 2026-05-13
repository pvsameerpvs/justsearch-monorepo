"use client";

import { Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TopItemRow, type TopItem } from "./dashboard/top-item-row";

const ITEMS: TopItem[] = [
  { name: "Whipped Hummus", orders: 42, prevOrders: 36, revenue: 588, category: "Starters", emoji: "🥗" },
  { name: "Citrus Grilled Salmon", orders: 38, prevOrders: 35, revenue: 1140, category: "Mains", emoji: "🐟" },
  { name: "Charred Halloumi", orders: 35, prevOrders: 28, revenue: 420, category: "Starters", emoji: "🧀" },
  { name: "Date Cake", orders: 28, prevOrders: 30, revenue: 336, category: "Desserts", emoji: "🍰" },
  { name: "Truffle Mushroom Risotto", orders: 24, prevOrders: 20, revenue: 720, category: "Mains", emoji: "🍄" },
];

const MAX_ORDERS = Math.max(...ITEMS.map((i) => i.orders));

export function TopMenuItems() {
  return (
    <div className="elegant-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Menu Items</h3>
            <p className="text-sm text-slate-500">Most ordered today</p>
          </div>
        </div>
        <Link href="/menu" className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          Menu <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 space-y-1 p-5 pt-0">
        {ITEMS.map((item, idx) => (
          <TopItemRow key={item.name} item={item} idx={idx} maxOrders={MAX_ORDERS} />
        ))}
      </div>
    </div>
  );
}
