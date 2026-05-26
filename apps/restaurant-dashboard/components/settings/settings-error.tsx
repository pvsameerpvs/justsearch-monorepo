import { AlertTriangle, RefreshCw } from "lucide-react";

interface SettingsErrorProps {
  onRetry: () => void;
}

export function SettingsError({ onRetry }: SettingsErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">Failed to load settings</h3>
        <p className="mt-1 text-sm text-slate-500">Please check your connection and try again.</p>
      </div>
      <button onClick={onRetry} className="elegant-btn-secondary">
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
