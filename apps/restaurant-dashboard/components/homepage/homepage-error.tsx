import { AlertTriangle } from "lucide-react";

interface HomepageErrorProps {
  error: Error;
  onRetry: () => void;
}

export function HomepageError({ error, onRetry }: HomepageErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-medium text-slate-900">Failed to load homepage data</p>
      <p className="text-xs text-slate-500">{error.message}</p>
      <button onClick={onRetry} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Try Again</button>
    </div>
  );
}
