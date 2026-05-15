import { AlertTriangle } from "lucide-react";

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
      <button onClick={onRetry} className="elegant-btn-secondary">Try Again</button>
    </div>
  );
}
