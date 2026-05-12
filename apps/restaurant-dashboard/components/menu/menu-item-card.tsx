import { Trash2, Eye, EyeOff } from "lucide-react";
import type { MenuItem } from "@/lib/stores/menu-store";

export function MenuItemCard({
  item,
  onToggle,
  onRemove,
}: {
  item: MenuItem;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`group rounded-xl border p-4 transition-all ${
        item.isAvailable ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900">{item.name}</p>
            {!item.isAvailable && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                Hidden
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
          <p className="mt-2 text-sm font-bold text-slate-900">AED {item.price}</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              item.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            }`}
          >
            {item.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
