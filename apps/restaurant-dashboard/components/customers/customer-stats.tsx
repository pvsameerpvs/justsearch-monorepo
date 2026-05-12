import { ShoppingBag, Gift } from 'lucide-react';
import type { Customer } from './types/customer.types';

export function CustomerStats({ customer }: { customer: Customer }) {
  return (
    <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
      <div className="flex items-center gap-1.5 text-xs">
        <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-bold text-slate-700">{customer.totalOrders}</span>
        <span className="text-slate-500">orders</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <Gift className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-bold text-slate-700">{customer.points}</span>
        <span className="text-slate-500">pts</span>
      </div>
      <div className="ml-auto text-xs font-bold text-slate-900">
        AED {customer.totalSpent.toLocaleString()}
      </div>
    </div>
  );
}
