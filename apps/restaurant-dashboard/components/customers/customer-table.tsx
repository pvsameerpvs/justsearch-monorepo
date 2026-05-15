import { Users } from "lucide-react";
import { CustomerTableRow } from "./customer-table-row";
import type { User } from "@/lib/hooks/use-users-query";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface CustomerTableProps {
  users: User[];
  orders: DashboardOrder[];
  onSelect: (id: string) => void;
}

export function CustomerTable({ users, orders, onSelect }: CustomerTableProps) {
  return (
    <div className="elegant-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <CustomerTableRow key={u.id} user={u} orders={orders} onClick={() => onSelect(u.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CustomerEmpty() {
  return (
    <div className="elegant-card flex flex-col items-center justify-center py-16 text-center">
      <Users className="h-8 w-8 text-slate-300 mb-3" />
      <p className="text-sm font-bold text-slate-900">No customers found</p>
      <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
    </div>
  );
}
