"use client";

import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { OrderRow } from "./dashboard/order-row";
import { getInitials, getAvatarColor } from "@/lib/utils/dashboard.utils";
import { timeAgo } from "@/lib/utils/time.utils";
import type { ApiOrder } from "@/lib/hooks/use-orders-query";

interface RecentOrdersProps {
  orders: ApiOrder[];
}

function mapApiOrderToRow(order: ApiOrder) {
  const customer = order.customerName || 'Guest';
  return {
    id: order.code || `#${order.id.slice(-4)}`,
    customer,
    items: order.items ?? 0,
    total: Math.round(Number(order.total || 0)),
    status: order.status,
    time: timeAgo(order.createdAt),
    type: order.fulfillmentType || 'delivery',
    avatar: getInitials(customer),
    avatarColor: getAvatarColor(customer),
  };
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const recent = orders.slice(0, 5).map(mapApiOrderToRow);

  return (
    <div className="elegant-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
            <p className="text-sm text-slate-500">Live order stream</p>
          </div>
        </div>
        <Link href="/orders" className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          All Orders <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-3 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
        <span>Customer</span>
        <span className="text-center">Status</span>
        <span className="text-right">Total</span>
      </div>

      {recent.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-400">
          No orders yet today
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {recent.map((o) => <OrderRow key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
