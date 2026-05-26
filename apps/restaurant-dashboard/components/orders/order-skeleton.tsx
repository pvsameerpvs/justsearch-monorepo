export function OrderSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-white/80 p-4 pl-6 space-y-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
