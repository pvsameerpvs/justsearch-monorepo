import { AlertCircle, RefreshCw } from "lucide-react";

interface OrderErrorProps {
  message: string;
  onRetry: () => void;
}

export function OrderError({ message, onRetry }: OrderErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200/60 bg-red-50/80 backdrop-blur-xl py-12 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 shadow-sm">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <p className="text-sm font-bold text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-bold text-red-600 border border-red-200/60 hover:bg-white shadow-sm transition-all"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
