import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function TrendBadge({ current, prev }: { current: number; prev?: number }) {
  if (prev === undefined) return null;
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
