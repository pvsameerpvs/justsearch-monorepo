"use client";

import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { OrderRow, type Order } from "./dashboard/order-row";

const ORDERS: Order[] = [
  { id: "#1024", customer: "Amina Hassan", items: 3, total: 142, status: "preparing", time: "2 min ago", type: "dine", avatar: "AH", avatarColor: "bg-rose-100 text-rose-700" },
  { id: "#1023", customer: "Khalid Al Mansoori", items: 2, total: 78, status: "confirmed", time: "8 min ago", type: "delivery", avatar: "KA", avatarColor: "bg-sky-100 text-sky-700" },
  { id: "#1022", customer: "Priya Nair", items: 4, total: 210, status: "ready", time: "15 min ago", type: "dine", avatar: "PN", avatarColor: "bg-amber-100 text-amber-700" },
  { id: "#1021", customer: "James Thornton", items: 1, total: 110, status: "out_for_delivery", time: "22 min ago", type: "delivery", avatar: "JT", avatarColor: "bg-emerald-100 text-emerald-700" },
  { id: "#1020", customer: "Sara Al Farsi", items: 2, total: 64, status: "completed", time: "38 min ago", type: "dine", avatar: "SF", avatarColor: "bg-violet-100 text-violet-700" },
];

export function RecentOrders() {
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

      <div className="divide-y divide-slate-50">
        {ORDERS.map((o) => <OrderRow key={o.id} order={o} />)}
      </div>
    </div>
  );
}
