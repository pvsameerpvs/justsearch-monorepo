import { Bike, Plus } from "lucide-react";

interface DeliveryEmptyProps {
  onAdd: () => void;
  canManage?: boolean;
}

export function DeliveryEmpty({ onAdd, canManage }: DeliveryEmptyProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
        <Bike className="h-6 w-6 text-indigo-500" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">No delivery agents yet</p>
      <p className="mt-1 text-xs text-slate-400">Add your first driver to start taking delivery orders</p>
      {canManage && (
        <button
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      )}
    </div>
  );
}
