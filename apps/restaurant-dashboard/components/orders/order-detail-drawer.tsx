"use client";

import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { useOrderDetailQuery } from "@/lib/hooks/use-orders-query";
import { mapApiOrderDetailToDashboard } from "./orders.utils";
import { OrderDetailHeader } from "./order-detail-header";
import { OrderCustomerInfo } from "./order-customer-info";
import { OrderItemsList } from "./order-items-list";
import { OrderTimeline } from "./order-timeline";
import { OrderTotals } from "./order-totals";
import { OrderDetailActions } from "./order-detail-actions";
import { OrderStatusStepper } from "./order-status-stepper";

interface OrderDetailDrawerProps {
  orderId: string;
  onClose: () => void;
  onAssign: () => void;
  onReject?: () => void;
  isKitchenStaff?: boolean;
}

export function OrderDetailDrawer({ orderId, onClose, onAssign, onReject, isKitchenStaff }: OrderDetailDrawerProps) {
  const { data, isLoading } = useOrderDetailQuery(orderId);
  const { agents } = useDeliveryBoyStore();

  if (isLoading || !data) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden p-5 space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const order = mapApiOrderDetailToDashboard(data.order, data.items);
  const assignedAgent = agents.find((a) => a.id === order.assignedAgentId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        <OrderDetailHeader code={order.code} status={order.status} createdAt={order.createdAt} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <OrderStatusStepper currentStatus={order.status} timeline={order.timeline} cancelled={order.status === "cancelled"} />
          <OrderCustomerInfo order={order} />
          <OrderItemsList items={order.orderItems} />
          <OrderTotals order={order} />
          <OrderTimeline timeline={order.timeline} />

          {assignedAgent && !isKitchenStaff && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Assigned Driver</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-900">{assignedAgent.name}</p>
                  <p className="text-xs text-indigo-600">{assignedAgent.phone}</p>
                </div>
                <button onClick={onAssign} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Change</button>
              </div>
            </div>
          )}
        </div>

        <OrderDetailActions
          orderId={order.id}
          status={order.status}
          type={order.type}
          hasAgent={!!assignedAgent}
          isKitchenStaff={isKitchenStaff}
          onAssign={onAssign}
          onReject={onReject}
        />
      </div>
    </div>
  );
}
