import { Phone, Star, Package, Sparkles } from "lucide-react";
import { getAgentStatus } from "./delivery-boy-status.utils";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

interface DeliveryBoyRowProps {
  agent: DeliveryBoy;
  assignedOrderCode: string | null;
  isRecommended?: boolean;
  isCurrentlyAssigned?: boolean;
  onAssign: () => void;
}

export function DeliveryBoyRow({ agent, assignedOrderCode, isRecommended, isCurrentlyAssigned, onAssign }: DeliveryBoyRowProps) {
  const status = getAgentStatus(agent);

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${status.bg} border-slate-200`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-sm font-bold text-slate-500">
        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900 truncate">{agent.name}</p>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.text} border border-slate-200`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          {isCurrentlyAssigned && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">Assigned</span>
          )}
          {isRecommended && !isCurrentlyAssigned && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Sparkles className="h-3 w-3" />Recommended
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {agent.phone}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {agent.rating}</span>
          <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {agent.completedToday} deliveries</span>
        </div>
        {assignedOrderCode && (
          <p className="mt-1 text-[11px] font-semibold text-amber-600">Currently on {assignedOrderCode}</p>
        )}
      </div>
      <button
        onClick={onAssign}
        disabled={!status.canAssign}
        className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${status.btn}`}
      >
        {isCurrentlyAssigned ? "Keep" : "Assign"}
      </button>
    </div>
  );
}
