export function DeliverySkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-slate-200" />
          <div className="h-3 w-32 rounded bg-slate-200" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
