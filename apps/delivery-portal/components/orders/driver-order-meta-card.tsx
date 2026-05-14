type DriverOrderMetaCardProps = {
  orderedAtLabel: string;
  itemCount: number;
  etaMinutes: number;
};

export function DriverOrderMetaCard({ orderedAtLabel, itemCount, etaMinutes }: DriverOrderMetaCardProps) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Ordered</span>
        <span className="font-medium text-slate-900">{orderedAtLabel}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-slate-600">
        <span>Items</span>
        <span className="font-medium text-slate-900">{itemCount} packed</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-slate-600">
        <span>ETA</span>
        <span className="font-medium text-slate-900">{etaMinutes} min</span>
      </div>
    </div>
  );
}
