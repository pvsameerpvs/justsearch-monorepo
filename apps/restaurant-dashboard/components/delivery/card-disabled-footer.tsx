import { UserX } from "lucide-react";

interface CardDisabledFooterProps {
  isDisabled: boolean;
}

export function CardDisabledFooter({ isDisabled }: CardDisabledFooterProps) {
  if (!isDisabled) return null;
  return (
    <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
      <UserX className="h-3 w-3 text-slate-400" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disabled — not accepting assignments</span>
    </div>
  );
}
