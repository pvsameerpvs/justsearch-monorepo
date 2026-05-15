import { AlertTriangle, RefreshCw } from "lucide-react";

interface DeliveryErrorProps {
  error: Error;
  onRetry: () => void;
}

export function DeliveryError({ error, onRetry }: DeliveryErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-medium text-slate-900">Failed to load delivery agents</p>
      <p className="text-xs text-slate-500">{error.message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
