import { Bike, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";

interface DeliveryBoyStatsProps {
  agents: DeliveryAgent[];
}

const STAT_CONFIG = [
  { key: "total", label: "Total", icon: Users, color: "bg-slate-100 text-slate-600 border-slate-200" },
  { key: "active", label: "Active", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { key: "online", label: "Available", icon: Bike, color: "bg-sky-50 text-sky-600 border-sky-200" },
  { key: "busy", label: "On Duty", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { key: "offline", label: "Offline", icon: XCircle, color: "bg-slate-100 text-slate-500 border-slate-200" },
] as const;

export function DeliveryBoyStats({ agents }: DeliveryBoyStatsProps) {
  const counts = {
    total: agents.length,
    active: agents.filter((a) => a.isActive).length,
    online: agents.filter((a) => a.isActive && a.status === "online" && (a.activeOrderCount ?? 0) === 0).length,
    busy: agents.filter((a) => a.isActive && (a.status === "busy" || (a.status === "online" && (a.activeOrderCount ?? 0) > 0))).length,
    offline: agents.filter((a) => a.isActive && a.status === "offline").length,
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {STAT_CONFIG.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.key} className={`rounded-xl border p-2.5 text-center ${s.color}`}>
            <Icon className="mx-auto h-4 w-4 mb-1" />
            <p className="text-lg font-bold">{counts[s.key as keyof typeof counts]}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
