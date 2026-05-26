import { AlertTriangle, RefreshCw } from "lucide-react";

interface MenuErrorProps {
  error: Error;
  onRetry: () => void;
}

export function MenuError({ error, onRetry }: MenuErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-red-500 font-medium">Failed to load menu</p>
      <p className="text-sm text-slate-500">{error.message}</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
