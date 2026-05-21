"use client";

import { useUpdateOrderStatusMutation } from "@/lib/hooks/use-orders-query";
import { ORDER_FLOW } from "./order-status-config";
import { ACTION_META, getNextStatus } from "./order-actions.constants";

interface OrderDetailActionsProps {
  orderId: string;
  status: string;
  type: string;
  hasAgent: boolean;
  isKitchenStaff?: boolean;
  onAssign: () => void;
  onReject?: () => void;
}

export function OrderDetailActions({ orderId, status, type, hasAgent, isKitchenStaff, onAssign, onReject }: OrderDetailActionsProps) {
  const { mutate: updateStatus } = useUpdateOrderStatusMutation();

  const next = getNextStatus(status, type, !!isKitchenStaff);
  const meta = ACTION_META[status];
  const nextLabel = ORDER_FLOW.find((s) => s.value === next)?.label ?? "Next";

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ orderId, status: newStatus });
  };

  if (isKitchenStaff) {
    if (!next) return null;
    return (
      <div className="border-t border-slate-100 p-4 space-y-2">
        <div className="space-y-1.5">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Next: {nextLabel}</p>
          <button
            onClick={() => handleStatusChange(next)}
            className={`w-full rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${meta?.color ?? 'bg-slate-500'} ${meta?.hover ?? 'hover:bg-slate-600'}`}>
            {meta?.label ?? "Next"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-100 p-4 space-y-2">
      {status === "pending" && (
        <div className="grid grid-cols-2 gap-2">
          {onReject ? (
            <button onClick={onReject} className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 flex items-center justify-center gap-1.5">
              Cancel Order
            </button>
          ) : (
            <button onClick={() => handleStatusChange("cancelled")} className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 flex items-center justify-center gap-1.5">
              Cancel Order
            </button>
          )}
          <button onClick={() => handleStatusChange("confirmed")} className="rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 flex items-center justify-center gap-1.5">
            {meta?.label ?? "Accept"}
          </button>
        </div>
      )}

      {next && status !== "pending" && meta && (
        <div className="space-y-1.5">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Next: {nextLabel}</p>
          <button
            onClick={() => handleStatusChange(next)}
            className={`w-full rounded-xl py-2.5 text-sm font-bold text-white transition-colors ${meta.color} ${meta.hover}`}>
            {meta.label}
          </button>
        </div>
      )}

      {type === "delivery" && (status === "ready" || status === "out_for_delivery") && (
        <button onClick={onAssign} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">{hasAgent ? "Reassign Driver" : "Assign Driver"}</button>
      )}
    </div>
  );
}
