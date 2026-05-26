import { CheckCircle } from "lucide-react";

interface SaveToastProps {
  message: string;
}

export function SaveToast({ message }: SaveToastProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      <CheckCircle className="h-4 w-4 text-emerald-400" />
      {message}
    </div>
  );
}
