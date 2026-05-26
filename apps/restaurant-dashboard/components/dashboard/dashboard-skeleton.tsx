export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-3">
            <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-5 w-14 rounded-full bg-slate-200 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
          <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
