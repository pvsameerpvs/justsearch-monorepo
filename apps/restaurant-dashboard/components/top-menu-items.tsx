import Link from "next/link";
import { Flame, ArrowUpRight, Trophy } from "lucide-react";
import { TopItemRow } from "./dashboard/top-item-row";
import type { TopItem } from "@/lib/hooks/use-analytics-query";

interface TopMenuItemsProps {
  items: TopItem[];
}

export function TopMenuItems({ items }: TopMenuItemsProps) {
  const topFive = items.slice(0, 5);
  const maxOrders = topFive.length > 0 ? Math.max(...topFive.map((i) => i.quantity)) : 1;

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/20 text-white">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Menu Items</h3>
            <p className="text-sm text-slate-500">Most ordered today</p>
          </div>
        </div>
        <Link href="/menu" className="group flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          Menu <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {topFive.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Trophy className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No sales data yet</p>
          <p className="text-xs text-slate-400 mt-1">Top items will rank here as orders come in</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2 p-5 pt-0">
          {topFive.map((item, idx) => (
            <TopItemRow key={item.name} item={item} idx={idx} maxOrders={maxOrders} />
          ))}
        </div>
      )}
    </div>
  );
}
