import { AlertTriangle, RefreshCw } from "lucide-react";

interface VoucherErrorProps {
  message: string;
  onRetry: () => void;
}

export function VoucherError({ message, onRetry }: VoucherErrorProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center py-16 text-center shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">Failed to load vouchers</p>
      <p className="text-xs text-slate-400 mb-4 max-w-xs">{message}</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
