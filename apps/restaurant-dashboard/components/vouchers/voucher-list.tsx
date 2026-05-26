import { Ticket } from "lucide-react";
import { VoucherCard } from "./voucher-card";
import type { Voucher } from "./types/voucher.types";

interface VoucherListProps {
  vouchers: Voucher[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function VoucherList({ vouchers, onEdit, onDelete, onToggle }: VoucherListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {vouchers.map((v) => (
        <VoucherCard
          key={v.id}
          voucher={v}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export function VoucherEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center py-16 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 mb-4">
        <Ticket className="h-7 w-7 text-amber-400" />
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">No vouchers yet</p>
      <p className="text-xs text-slate-400 mb-4 max-w-xs">
        Create percentage or fixed-amount vouchers with start/end dates and usage limits.
      </p>
      <button onClick={onAdd} className="elegant-btn-primary">
        Create First Voucher
      </button>
    </div>
  );
}
