import { Star, ClipboardList } from "lucide-react";
import { DeliveryBoyCardHeader } from "./delivery-boy-card-header";
import { CardDisabledFooter } from "./card-disabled-footer";
import { CardInfoGrid } from "./card-info-grid";
import { DriverLoginInfo } from "./driver-login-info";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";

interface DeliveryBoyCardProps {
  agent: DeliveryAgent;
  onToggleActive: () => void;
  onRemove: () => void;
  onEdit: () => void;
  onViewOrders: () => void;
  canManage?: boolean;
}

export function DeliveryBoyCard({ agent, onToggleActive, onRemove, onEdit, onViewOrders, canManage }: DeliveryBoyCardProps) {
  const isDisabled = !agent.isActive;

  return (
    <div className={`elegant-card p-0 overflow-hidden transition-opacity ${isDisabled ? "opacity-60" : ""}`}>
      <DeliveryBoyCardHeader
        agent={agent}
        canManage={canManage}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onRemove={onRemove}
      />

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
              {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{agent.name}</p>
              <p className="text-[10px] font-mono text-slate-500">ID: {agent.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700">{agent.rating}</span>
          </div>
        </div>

        <CardInfoGrid agent={agent} />
        <DriverLoginInfo uniqueId={agent.username} />
      </div>

      <button
        onClick={onViewOrders}
        className="w-full flex items-center justify-center gap-2 border-t border-slate-100 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        <ClipboardList className="h-4 w-4" />
        View Orders
      </button>

      <CardDisabledFooter isDisabled={isDisabled} />
    </div>
  );
}
