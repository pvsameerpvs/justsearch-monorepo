interface Props { usageCount: number; usageLimit: number; }

export function VoucherUsageBar({ usageCount, usageLimit }: Props) {
  const pct = Math.min(100, Math.round((usageCount / usageLimit) * 100));
  const isFull = usageCount >= usageLimit;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className={`font-bold ${isFull ? "text-red-600" : "text-slate-500"}`}>{usageCount} / {usageLimit} used</span>
        <span className={`font-bold ${isFull ? "text-red-600" : "text-slate-500"}`}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
