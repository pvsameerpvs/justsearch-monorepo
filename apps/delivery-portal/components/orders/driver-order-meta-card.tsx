import { Clock, Package, Timer } from "lucide-react";

type DriverOrderMetaCardProps = {
  orderedAtLabel: string;
  itemCount: number;
  etaMinutes: number;
};

export function DriverOrderMetaCard({ orderedAtLabel, itemCount, etaMinutes }: DriverOrderMetaCardProps) {
  return (
    <div className="mx-4 mb-3 rounded-[16px] border border-slate-100 bg-slate-50 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Ordered</span>
        </div>
        <span className="text-xs font-bold text-slate-900">{orderedAtLabel}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Package className="h-3.5 w-3.5 text-slate-400" />
          <span>Items</span>
        </div>
        <span className="text-xs font-bold text-slate-900">{itemCount} packed</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Timer className="h-3.5 w-3.5 text-slate-400" />
          <span>ETA</span>
        </div>
        <span className="text-xs font-bold text-slate-900">{etaMinutes} min</span>
      </div>
    </div>
  );
}
