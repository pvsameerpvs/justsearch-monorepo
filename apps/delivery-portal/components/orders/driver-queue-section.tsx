import { ListOrdered } from "lucide-react";
import { DriverQueueItem } from "./driver-queue-item";
import { sortOrdersByUrgency } from "./driver-queue-utils";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverQueueSectionProps = {
  orders: DeliveryOrder[];
  currentOrderId: string;
};

export function DriverQueueSection({ orders, currentOrderId }: DriverQueueSectionProps) {
  const queue = sortOrdersByUrgency(orders).filter((o) => o.id !== currentOrderId && o.status !== 'delivered' && o.status !== 'cancelled');

  if (queue.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <ListOrdered className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-bold text-slate-900">Up next ({queue.length})</h3>
      </div>
      <div className="space-y-2">
        {queue.map((order, index) => (
          <DriverQueueItem
            key={order.assignmentId}
            order={order}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
