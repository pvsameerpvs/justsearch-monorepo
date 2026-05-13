import { Ticket, CalendarDays, Wallet } from "lucide-react";
import type { VoucherUsage } from "./types/customer.types";

interface CustomerDetailVouchersProps {
  vouchers: VoucherUsage[];
}

export function CustomerDetailVouchers({ vouchers }: CustomerDetailVouchersProps) {
  if (vouchers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Ticket className="h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-bold text-slate-900">No vouchers used</p>
        <p className="text-xs text-slate-400 mt-1">This customer hasn't used any vouchers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vouchers.map((v, index) => (
        <div key={index} className="elegant-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Ticket className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{v.code}</span>
                  <span className="text-xs text-slate-500">{v.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CalendarDays className="h-3 w-3" />
                  {v.usedAt}
                  <Wallet className="h-3 w-3" />
                  AED {v.orderTotal}
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-600">{v.discount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
