import { Trash2, Star, MapPin } from "lucide-react";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

export function DeliveryAgentCard({
  agent,
  onRemove,
}: {
  agent: DeliveryBoy;
  onRemove: () => void;
}) {
  return (
    <div className="elegant-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
            {agent.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
            <p className="text-[10px] font-mono text-amber-600">{agent.uniqueId}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" /> {agent.phone}
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-700">{agent.rating}</span> rating
        </div>
      </div>

      <div className="mt-3 rounded-md bg-slate-50 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Portal</p>
        <p className="mt-0.5 text-[10px] font-mono text-slate-600">
          name-{agent.uniqueId}.js-restorant.com
        </p>
      </div>
    </div>
  );
}
