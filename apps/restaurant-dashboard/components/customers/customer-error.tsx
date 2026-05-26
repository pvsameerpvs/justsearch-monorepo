import { AlertCircle, RefreshCw } from "lucide-react";

interface CustomerErrorProps {
  error: Error;
  onRetry: () => void;
}

export function CustomerError({ error, onRetry }: CustomerErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <div>
        <p className="text-sm font-bold text-slate-900">Failed to load customers</p>
        <p className="text-xs text-slate-500 mt-1">{error.message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Try Again
      </button>
    </div>
  );
}
