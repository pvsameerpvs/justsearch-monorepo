import { AlertCircle } from "lucide-react";

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
        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
