import { Ticket, Calendar, ShoppingBag } from "lucide-react";
import { VoucherCardActions } from "./voucher-card-actions";
import { VoucherUsageBar } from "./voucher-usage-bar";
import type { Voucher } from "./types/voucher.types";

interface Props { voucher: Voucher; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggle: (id: string) => void; }

export function VoucherCard({ voucher, onEdit, onDelete, onToggle }: Props) {
  const isPct = voucher.type === "percentage";
  const label = isPct ? `${voucher.value}% OFF` : `AED ${voucher.value} OFF`;
  return (
    <div className="elegant-card p-0 overflow-hidden">
      <VoucherCardActions voucher={voucher} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Ticket className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{voucher.title}</p>
              <p className="text-[10px] font-mono text-slate-500">{voucher.code}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-amber-600">{label}</p>
            <p className="text-[10px] text-slate-400">{isPct ? `Max AED ${voucher.maxDiscount}` : "Fixed amount"}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{voucher.description}</p>
        <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-3">
          <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />Min AED {voucher.minOrderValue}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{voucher.startDate} → {voucher.endDate}</span>
        </div>
        <VoucherUsageBar usageCount={voucher.usageCount} usageLimit={voucher.usageLimit} />
      </div>
    </div>
  );
}
