import Link from "next/link";
import { ShoppingBag, ChevronRight, ArrowUpRight } from "lucide-react";
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
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
            <p className="text-sm text-slate-500">Live order stream</p>
          </div>
        </div>
        <Link href="/orders" className="group flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          All Orders <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100/80">
        <span>Customer</span>
        <span className="text-center">Status</span>
        <span className="text-right">Total</span>
      </div>

      {recent.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No orders yet today</p>
          <p className="text-xs text-slate-400 mt-1">New orders will appear here automatically</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50/80">
          {recent.map((o) => <OrderRow key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
