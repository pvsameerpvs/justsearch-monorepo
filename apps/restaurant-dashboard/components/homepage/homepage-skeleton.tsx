export function HomepageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-4 w-96 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
        <div className="space-y-5">
          <div className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
        <div className="h-[600px] rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
