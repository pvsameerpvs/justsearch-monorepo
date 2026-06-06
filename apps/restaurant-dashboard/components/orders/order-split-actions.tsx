import { Ban, Check } from "lucide-react";

interface OrderSplitActionsProps {
  onReject: (e: React.MouseEvent) => void;
  onAccept: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export function OrderSplitActions({ onReject, onAccept, disabled }: OrderSplitActionsProps) {
  return (
    <div className="flex border-t border-slate-100/80">
      <button
        disabled={disabled}
        onClick={onReject}
        className={`group flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50/80 transition-colors border-r border-slate-100/80 flex items-center justify-center gap-1.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Ban className="h-4 w-4 transition-transform group-hover:scale-110" />
        Cancel Order
      </button>
      <button
        disabled={disabled}
        onClick={onAccept}
        className={`group flex-1 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50/80 transition-colors flex items-center justify-center gap-1.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
        Accept Order
      </button>
    </div>
  );
}
