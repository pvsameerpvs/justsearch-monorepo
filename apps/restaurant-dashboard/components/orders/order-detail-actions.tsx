import { useUpdateOrderStatusMutation } from "@/lib/hooks/use-orders-query";
import { ORDER_FLOW } from "./order-status-config";

interface OrderDetailActionsProps {
  orderId: string;
  status: string;
  type: string;
  hasAgent: boolean;
  isKitchenStaff?: boolean;
  onAssign: () => void;
}

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "out_for_delivery",
  out_for_delivery: "completed",
};

const KITCHEN_NEXT_STATUS: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
};

const ACTION_META: Record<string, { label: string; color: string; hover: string }> = {
  pending:     { label: "Accept Order",            color: "bg-emerald-500",      hover: "hover:bg-emerald-600" },
  confirmed:   { label: "Start Preparing",         color: "bg-amber-500",       hover: "hover:bg-amber-600" },
  preparing:   { label: "Mark Ready for Delivery", color: "bg-violet-500",      hover: "hover:bg-violet-600" },
  ready:       { label: "Send Out for Delivery",   color: "bg-indigo-500",      hover: "hover:bg-indigo-600" },
  out_for_delivery: { label: "Mark Completed",     color: "bg-emerald-500",      hover: "hover:bg-emerald-600" },
};

export function OrderDetailActions({ orderId, status, type, hasAgent, isKitchenStaff, onAssign }: OrderDetailActionsProps) {
  const { mutate: updateStatus } = useUpdateOrderStatusMutation();

  const next = isKitchenStaff ? KITCHEN_NEXT_STATUS[status] : NEXT_STATUS[status];
  const meta = ACTION_META[status];
  const nextLabel = ORDER_FLOW.find((s) => s.value === next)?.label ?? "Next";

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ orderId, status: newStatus });
  };

  // Kitchen staff view
  if (isKitchenStaff) {
    if (!next) return null;

    return (
      <div className="border-t border-slate-100 p-4 space-y-2">
        <div className="space-y-1.5">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Next: {nextLabel}
          </p>
          <button
            onClick={() => handleStatusChange(next)}
            className={`w-full rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${meta.color} ${meta.hover}`}
          >
            {meta.label}
          </button>
        </div>
      </div>
    );
  }

  // Default staff view
  return (
    <div className="border-t border-slate-100 p-4 space-y-2">
      {status === "pending" && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handleStatusChange("cancelled")} className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100">
            Reject
          </button>
          <button onClick={() => handleStatusChange("confirmed")} className="rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">
            {meta?.label ?? "Accept"}
          </button>
        </div>
      )}

      {next && status !== "pending" && meta && (
        <div className="space-y-1.5">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Next: {nextLabel}
          </p>
          <button
            onClick={() => handleStatusChange(next)}
            className={`w-full rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${meta.color} ${meta.hover}`}
          >
            {meta.label}
          </button>
        </div>
      )}

      {type === "delivery" && (
        <button onClick={onAssign} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          {hasAgent ? "Reassign Driver" : "Assign Driver"}
        </button>
      )}
    </div>
  );
}
