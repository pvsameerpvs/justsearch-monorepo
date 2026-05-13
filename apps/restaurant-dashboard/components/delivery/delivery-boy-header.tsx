import { Plus, Bike } from "lucide-react";

interface DeliveryBoyHeaderProps {
  total: number;
  onAdd: () => void;
}

export function DeliveryBoyHeader({ total, onAdd }: DeliveryBoyHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Bike className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery Agents</h3>
          <p className="text-xs text-slate-500">{total} registered drivers</p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" /> Add Driver
      </button>
    </div>
  );
}
