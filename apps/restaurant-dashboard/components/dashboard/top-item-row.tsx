"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface TopItem {
  name: string;
  orders: number;
  prevOrders: number;
  revenue: number;
  category: string;
  emoji: string;
}

const RANK_STYLE = [
  { bg: "bg-amber-50", border: "border-amber-200", num: "🥇" },
  { bg: "bg-slate-100", border: "border-slate-200", num: "🥈" },
  { bg: "bg-orange-50", border: "border-orange-200", num: "🥉" },
  { bg: "bg-white", border: "border-slate-100", num: "4" },
  { bg: "bg-white", border: "border-slate-100", num: "5" },
];

function TrendBadge({ current, prev }: { current: number; prev: number }) {
  const diff = current - prev;
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : 0;

  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
        <TrendingUp className="h-3 w-3" /> +{pct}%
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
        <TrendingDown className="h-3 w-3" /> {pct}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
      <Minus className="h-3 w-3" /> 0%
    </span>
  );
}

export function TopItemRow({ item, idx, maxOrders }: { item: TopItem; idx: number; maxOrders: number }) {
  const rank = RANK_STYLE[idx];
  const pct = (item.orders / maxOrders) * 100;

  return (
    <div className={`group flex items-center gap-3 rounded-xl border ${rank.border} ${rank.bg} p-3 transition-all hover:shadow-sm`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-sm font-bold text-slate-400">
        {rank.num}
      </div>
      <span className="text-xl shrink-0">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
          <TrendBadge current={item.orders} prev={item.prevOrders} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200/60">
            <div className="h-full rounded-full bg-slate-800 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[11px] font-bold text-slate-600">{item.orders}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] text-slate-400">{item.category}</span>
          <span className="text-[10px] text-slate-300">·</span>
          <span className="text-[10px] text-slate-400">AED {item.revenue} revenue</span>
        </div>
      </div>
    </div>
  );
}
