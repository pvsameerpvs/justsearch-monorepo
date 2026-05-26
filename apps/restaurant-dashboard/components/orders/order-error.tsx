import { AlertCircle, RefreshCw } from "lucide-react";

interface OrderErrorProps {
  message: string;
  onRetry: () => void;
}

export function OrderError({ message, onRetry }: OrderErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 py-12">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-semibold text-red-700">{message}</p>
      <button onClick={onRetry} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors shadow-sm">
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
