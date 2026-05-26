"use client";

import { Clock, ShoppingBag, Bike, UtensilsCrossed, CheckCircle2 } from "lucide-react";

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  time: string;
  type: string;
  avatar: string;
  avatarColor: string;
}

const DEFAULT_STATUS = { label: "Unknown", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", icon: ShoppingBag, glow: "shadow-slate-500/10" };

const STATUS_META: Record<string, { label: string; dot: string; bg: string; text: string; border: string; icon: React.ElementType; glow: string }> = {
  preparing:       { label: "Preparing",        dot: "bg-amber-500",  bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  icon: UtensilsCrossed, glow: "shadow-amber-500/15" },
  confirmed:       { label: "Confirmed",        dot: "bg-sky-500",    bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    icon: ShoppingBag, glow: "shadow-sky-500/15" },
  ready:           { label: "Ready",            dot: "bg-emerald-500",bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",icon: CheckCircle2, glow: "shadow-emerald-500/15" },
  out_for_delivery:{ label: "Out for Delivery", dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: Bike, glow: "shadow-indigo-500/15" },
  completed:       { label: "Delivered",        dot: "bg-slate-400",  bg: "bg-slate-100", text: "text-slate-700",  border: "border-slate-200",  icon: CheckCircle2, glow: "shadow-slate-500/10" },
  cancelled:       { label: "Cancelled",        dot: "bg-red-500",    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: ShoppingBag, glow: "shadow-red-500/15" },
  pending:         { label: "Pending",          dot: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: ShoppingBag, glow: "shadow-orange-500/15" },
};

const TYPE_ICON: Record<string, React.ElementType> = { dine_in: UtensilsCrossed, delivery: Bike, pickup: ShoppingBag };

export function OrderRow({ order }: { order: Order }) {
  const s = STATUS_META[order.status] ?? DEFAULT_STATUS;
  const StatusIcon = s.icon;
  const TypeIcon = TYPE_ICON[order.type] ?? ShoppingBag;

  return (
    <div className="group grid grid-cols-[1fr_auto_auto] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-default">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${order.avatarColor} ring-1 ring-black/5`}>
          {order.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 truncate">{order.customer}</p>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{order.id}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" /> {order.time}
            </span>
            <span className="text-[11px] text-slate-300">·</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <TypeIcon className="h-3 w-3" /> {order.items} items
            </span>
          </div>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm ${s.bg} ${s.text} ${s.border} ${s.glow}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        <StatusIcon className="h-3 w-3" />
        {s.label}
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-900">AED {order.total}</p>
      </div>
    </div>
  );
}
