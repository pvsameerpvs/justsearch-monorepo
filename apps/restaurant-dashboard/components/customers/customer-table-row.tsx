import { Phone, Mail, ShoppingBag, Wallet, CalendarDays, ChevronRight, UserCircle } from "lucide-react";
import type { User } from "@/lib/hooks/use-users-query";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface CustomerTableRowProps {
  user: User;
  orders: DashboardOrder[];
  onClick: () => void;
}

export function CustomerTableRow({ user, orders, onClick }: CustomerTableRowProps) {
  const userOrders = orders.filter((o) => o.customerPhone === user.phone || o.customerName === user.name);
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const joinedDate = user.createdAt.slice(0, 10);

  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-[10px] font-mono text-slate-500">{user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Phone className="h-3 w-3 text-slate-400" />
            {user.phone}
          </div>
          {user.email && (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Mail className="h-3 w-3 text-slate-400" />
              {user.email}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <UserCircle className="h-3 w-3 text-slate-400" />
          {user.role}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-slate-700 font-bold">
            <ShoppingBag className="h-3 w-3 text-slate-400" />
            {totalOrders} orders
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Wallet className="h-3 w-3 text-slate-400" />
            AED {totalSpent.toLocaleString()}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3 w-3 text-slate-400" />
          {joinedDate}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <ChevronRight className="h-4 w-4 text-slate-300 inline-block" />
      </td>
    </tr>
  );
}
