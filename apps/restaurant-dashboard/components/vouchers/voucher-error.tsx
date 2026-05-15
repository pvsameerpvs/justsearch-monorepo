import { AlertTriangle } from "lucide-react";

interface VoucherErrorProps {
  message: string;
  onRetry: () => void;
}

export function VoucherError({ message, onRetry }: VoucherErrorProps) {
  return (
    <div className="elegant-card flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
        <AlertTriangle className="h-7 w-7 text-red-300" />
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">Failed to load vouchers</p>
      <p className="text-xs text-slate-400 mb-4 max-w-xs">{message}</p>
      <button onClick={onRetry} className="elegant-btn-primary">
        Try Again
      </button>
    </div>
  );
}
