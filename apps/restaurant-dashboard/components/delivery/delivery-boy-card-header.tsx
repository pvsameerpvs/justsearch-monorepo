import { EnableToggle } from "./enable-toggle";
import { STATUS_META, type AgentStatus } from "./agent-status-meta";
import { Trash2, Pencil } from "lucide-react";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";

interface DeliveryBoyCardHeaderProps {
  agent: DeliveryAgent;
  canManage?: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export function DeliveryBoyCardHeader({ agent, canManage, onToggleActive, onEdit, onRemove }: DeliveryBoyCardHeaderProps) {
  const effectiveStatus: AgentStatus = agent.status === "offline"
    ? "offline"
    : (agent.status === "busy" || (agent.activeOrderCount ?? 0) > 0 ? "busy" : "online");
  const meta = STATUS_META[effectiveStatus] ?? STATUS_META.offline;

  return (
    <div className={`flex items-center justify-between border-b px-4 py-2 ${meta.bg} ${meta.border}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${meta.dot} ${effectiveStatus === "online" ? "animate-pulse" : ""}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.text}`}>{meta.label}</span>
      </div>
      <div className="flex items-center gap-1">
        {canManage && (
          <>
            <EnableToggle isActive={agent.isActive} onToggle={onToggleActive} />
            <button onClick={onEdit} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onRemove} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
