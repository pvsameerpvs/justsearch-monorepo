import { Phone, MapPin, CreditCard, StickyNote, Wallet, User } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";

export function OrderCustomerInfo({ order }: { order: DashboardOrder }) {
  const initials = order.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white text-sm font-bold">
          {initials}
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">{order.customerName}</p>
          <p className="text-xs text-slate-500">{order.type.replace("_", " ").toUpperCase()}</p>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="h-4 w-4 text-slate-400 shrink-0" />
          {order.customerName}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          {order.customerPhone}
        </div>
        {order.alternateNumber && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-slate-500">Alt:</span> {order.alternateNumber}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          {order.address}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
          {order.paymentMethod}
        </div>
        {order.notes && (
          <div className="flex items-start gap-2 text-sm text-amber-700">
            <StickyNote className="h-4 w-4 shrink-0 mt-0.5" />
            {order.notes}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5">
        <Wallet className="h-4 w-4 text-emerald-600 shrink-0" />
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-emerald-700">Payment Method</span>
          <span className="text-xs font-bold text-emerald-800 uppercase">{order.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}
