import { X } from "lucide-react";
import { CustomerTierBadge } from "./customer-tier-badge";
import type { Customer } from "./types/customer.types";

interface CustomerDetailHeaderProps {
  customer: Customer;
  onClose: () => void;
}

export function CustomerDetailHeader({ customer, onClose }: CustomerDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-base font-bold text-indigo-700">
          {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">{customer.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <CustomerTierBadge tier={customer.vipTier} />
            <span className="text-xs text-slate-500">{customer.points.toLocaleString()} pts</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
