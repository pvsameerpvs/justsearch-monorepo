export function MenuSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-xl bg-slate-100 animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 space-y-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
            <div className="h-6 w-32 rounded-lg bg-slate-100 animate-pulse" />
            <div className="space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
