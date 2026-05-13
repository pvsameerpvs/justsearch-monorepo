import { Phone, Mail, MapPin, ShoppingBag, Wallet, CalendarDays, ChevronRight, Coins } from "lucide-react";
import type { Customer } from "./types/customer.types";
import { CustomerTierBadge } from "./customer-tier-badge";

interface CustomerTableRowProps {
  customer: Customer;
  onClick: () => void;
}

export function CustomerTableRow({ customer, onClick }: CustomerTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{customer.name}</p>
            <p className="text-[10px] font-mono text-slate-500">{customer.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Phone className="h-3 w-3 text-slate-400" />
            {customer.phone}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Mail className="h-3 w-3 text-slate-400" />
            {customer.email}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <CustomerTierBadge tier={customer.vipTier} />
        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
          <Coins className="h-3 w-3" />
          {customer.points.toLocaleString()} pts
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-700 font-bold">
            <ShoppingBag className="h-3 w-3 text-slate-400" />
            {customer.totalOrders} orders
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Wallet className="h-3 w-3 text-slate-400" />
            AED {customer.totalSpent.toLocaleString()}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="h-3 w-3 text-slate-400" />
            {customer.location}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays className="h-3 w-3 text-slate-400" />
            {customer.lastVisit}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <ChevronRight className="h-4 w-4 text-slate-300 inline-block" />
      </td>
    </tr>
  );
}
