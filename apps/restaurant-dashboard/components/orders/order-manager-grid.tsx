import { Package, ClipboardList } from "lucide-react";
import { OrderCard } from "./order-card";
import { OrderHistoryCard } from "./order-history-card";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderManagerGridProps {
  orders: DashboardOrder[];
  isActiveTab: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAdvance: (id: string, status: string, type: string) => void;
  onAssign: (id: string) => void;
  onView: (id: string) => void;
}

export function OrderManagerGrid({ orders, isActiveTab, onAccept, onReject, onAdvance, onAssign, onView }: OrderManagerGridProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          {isActiveTab ? <ClipboardList className="h-7 w-7 text-slate-400" /> : <Package className="h-7 w-7 text-slate-400" />}
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600">
          {isActiveTab ? "No active orders right now" : "No orders in history"}
        </p>
        <p className="mt-1 text-xs text-slate-400 max-w-xs text-center">
          {isActiveTab 
            ? "New orders will appear here automatically. Keep this page open." 
            : "Try adjusting your date filter or switch to the Active tab."}
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
              onReject={() => onReject(order.id)}
              onAdvance={() => onAdvance(order.id, order.status, order.type)}
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
