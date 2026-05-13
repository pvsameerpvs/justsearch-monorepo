"use client";

import { useOrderStore } from "@/lib/stores/order-store";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
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
}

export function OrderDetailDrawer({ orderId, onClose, onAssign }: OrderDetailDrawerProps) {
  const { orders } = useOrderStore();
  const { agents } = useDeliveryBoyStore();

  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

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

          {assignedAgent && (
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
          onAssign={onAssign}
        />
      </div>
    </div>
  );
}
