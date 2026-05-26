"use client";

import Link from "next/link";
import { Flame, ArrowUpRight } from "lucide-react";
import { TopItemRow } from "./dashboard/top-item-row";
import type { TopItem } from "@/lib/hooks/use-analytics-query";

interface TopMenuItemsProps {
  items: TopItem[];
}

export function TopMenuItems({ items }: TopMenuItemsProps) {
  const topFive = items.slice(0, 5);
  const maxOrders = topFive.length > 0 ? Math.max(...topFive.map((i) => i.quantity)) : 1;

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

      {topFive.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-400">
          No sales data yet
        </div>
      ) : (
        <div className="mt-4 space-y-1 p-5 pt-0">
          {topFive.map((item, idx) => (
            <TopItemRow key={item.name} item={item} idx={idx} maxOrders={maxOrders} />
          ))}
        </div>
      )}
    </div>
  );
}
