"use client";

import { TrendBadge } from "./trend-badge";

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
  prevOrders?: number;
  category?: string;
  emoji?: string;
}

const RANK_STYLE = [
  { bg: "bg-gradient-to-r from-amber-50 to-orange-50", border: "border-amber-200/60", num: "🥇", barFrom: "from-amber-400", barTo: "to-orange-500" },
  { bg: "bg-gradient-to-r from-slate-50 to-slate-100/50", border: "border-slate-200/60", num: "🥈", barFrom: "from-slate-400", barTo: "to-slate-500" },
  { bg: "bg-gradient-to-r from-orange-50 to-amber-50", border: "border-orange-200/60", num: "🥉", barFrom: "from-orange-400", barTo: "to-amber-500" },
  { bg: "bg-white", border: "border-slate-100", num: "4", barFrom: "from-slate-400", barTo: "to-slate-500" },
  { bg: "bg-white", border: "border-slate-100", num: "5", barFrom: "from-slate-400", barTo: "to-slate-500" },
];

export function TopItemRow({ item, idx, maxOrders }: { item: TopItem; idx: number; maxOrders: number }) {
  const rank = RANK_STYLE[idx];
  const pct = (item.quantity / maxOrders) * 100;

  return (
    <div className={`group flex items-center gap-3 rounded-xl border ${rank.border} ${rank.bg} p-3 transition-all hover:shadow-md hover:scale-[1.01] cursor-default`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-sm font-bold text-slate-500 ring-1 ring-black/5">
        {rank.num}
      </div>
      {item.emoji && <span className="text-xl shrink-0">{item.emoji}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
          <TrendBadge current={item.quantity} prev={item.prevOrders} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/50">
            <div className={`h-full rounded-full bg-gradient-to-r ${rank.barFrom} ${rank.barTo} transition-all`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[11px] font-bold text-slate-600 tabular-nums">{item.quantity}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          {item.category && (
            <>
              <span className="text-[10px] font-medium text-slate-400">{item.category}</span>
              <span className="text-[10px] text-slate-300">·</span>
            </>
          )}
          <span className="text-[10px] font-medium text-slate-400">AED {Math.round(item.revenue).toLocaleString()} revenue</span>
        </div>
      </div>
    </div>
  );
}
