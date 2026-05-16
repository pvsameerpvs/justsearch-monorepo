import { MapPin, Phone, Star, Package } from "lucide-react";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

interface DeliveryBoyRowProps {
  agent: DeliveryBoy;
  assignedOrderCode: string | null;
  onAssign: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string; btn: string }> = {
  available: { label: "Available", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", btn: "bg-emerald-500 text-white hover:bg-emerald-600" },
  busy: { label: "On Delivery", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", btn: "bg-slate-200 text-slate-400 cursor-not-allowed" },
  offline: { label: "Offline", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", btn: "bg-slate-200 text-slate-400 cursor-not-allowed" },
};

export function DeliveryBoyRow({ agent, assignedOrderCode, onAssign }: DeliveryBoyRowProps) {
  const status = STATUS_CONFIG[agent.status];
  const canAssign = agent.status === "available";

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${status.bg} border-slate-200`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-sm font-bold text-slate-500">
        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900 truncate">{agent.name}</p>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.text} border border-slate-200`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {agent.location}</span>
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
        disabled={!canAssign}
        className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${canAssign ? status.btn : status.btn}`}
      >
        {canAssign ? "Assign" : agent.status === "busy" ? "Busy" : "Offline"}
      </button>
    </div>
  );
}
