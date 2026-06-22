export function ScratchCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
      <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-16 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
