"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function TrendBadge({ current, prev }: { current: number; prev?: number }) {
  if (prev === undefined) return null;
  const diff = current - prev;
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : 0;

  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 shadow-sm shadow-emerald-500/10">
        <TrendingUp className="h-3 w-3" /> +{pct}%
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200/60 shadow-sm shadow-red-500/10">
        <TrendingDown className="h-3 w-3" /> {pct}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200/60">
      <Minus className="h-3 w-3" /> 0%
    </span>
  );
}
