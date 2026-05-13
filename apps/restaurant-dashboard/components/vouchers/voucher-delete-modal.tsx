import { AlertTriangle } from "lucide-react";
import type { Voucher } from "./types/voucher.types";

interface VoucherDeleteModalProps {
  voucher: Voucher | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VoucherDeleteModal({ voucher, onConfirm, onCancel }: VoucherDeleteModalProps) {
  if (!voucher) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm">
        <div className="elegant-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Delete Voucher</p>
              <p className="text-xs text-slate-500">This action cannot be undone</p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-sm font-bold text-slate-900">{voucher.title}</p>
            <p className="text-[10px] font-mono text-slate-500">{voucher.code}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={onCancel} className="elegant-btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
