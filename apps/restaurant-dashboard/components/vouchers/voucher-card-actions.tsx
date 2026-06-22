import { Pause, Play, Pencil, Trash2 } from "lucide-react";
import { VoucherStatusBadge } from "./voucher-status-badge";
import { getVoucherStatus } from "./hooks/voucher-status-helpers";
import type { Voucher } from "./types/voucher.types";

interface Props { voucher: Voucher; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggle: (id: string) => void; }

export function VoucherCardActions({ voucher, onEdit, onDelete, onToggle }: Props) {
  const status = getVoucherStatus(voucher);
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <VoucherStatusBadge status={status} />
      <div className="flex items-center gap-1">
        <button onClick={() => onToggle(voucher.id)}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${voucher.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-50"}`}
          title={voucher.isActive ? "Pause" : "Activate"}>
          {voucher.isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button onClick={() => onEdit(voucher.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onDelete(voucher.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
