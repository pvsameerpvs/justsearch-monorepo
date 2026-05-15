export function VoucherSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="elegant-card p-0 overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
            <div className="flex gap-1">
              <div className="h-7 w-7 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-7 w-7 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-7 w-7 rounded-md bg-slate-200 animate-pulse" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-6 w-16 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-12 rounded bg-slate-200 animate-pulse ml-auto" />
              </div>
            </div>
            <div className="h-8 w-full rounded bg-slate-200 animate-pulse" />
            <div className="h-2 w-full rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
