export function CustomerSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-16 bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="h-10 bg-slate-100 rounded-xl max-w-sm" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
