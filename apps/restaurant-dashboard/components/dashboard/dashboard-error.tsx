import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  message: string;
  onRetry?: () => void;
}

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-12">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm font-semibold text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        )}
      </div>
    </div>
  );
}
