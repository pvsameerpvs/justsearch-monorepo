import type { DashboardOrder } from "@/lib/stores/order-store";
import { OrderCard } from "./order-card";
import { OrderHistoryCard } from "./order-history-card";
import { Package } from "lucide-react";

interface OrderManagerGridProps {
  orders: DashboardOrder[];
  isActiveTab: boolean;
  onAccept: (id: string) => void;
  onAssign: (id: string) => void;
  onView: (id: string) => void;
}

export function OrderManagerGrid({ orders, isActiveTab, onAccept, onAssign, onView }: OrderManagerGridProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <Package className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">
          {isActiveTab ? "No active orders" : "No orders for this period"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {isActiveTab
        ? orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => onAccept(order.id)}
              onAssign={() => onAssign(order.id)}
              onView={() => onView(order.id)}
            />
          ))
        : orders.map((order) => (
            <OrderHistoryCard
              key={order.id}
              order={order}
              onView={() => onView(order.id)}
            />
          ))}
    </div>
  );
}
