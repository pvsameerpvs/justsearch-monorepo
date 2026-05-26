export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-2xl bg-slate-200" />
        <div className="h-96 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
