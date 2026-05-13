import { Package } from "lucide-react";

interface OrderCardFooterProps {
  isPending: boolean;
  hasAgent: boolean;
  onAccept: () => void;
  onAssign: () => void;
}

export function OrderCardFooter({ isPending, hasAgent, onAccept, onAssign }: OrderCardFooterProps) {
  if (isPending) {
    return (
      <div className="flex border-t border-slate-100">
        <button onClick={() => {}} className="flex-1 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors border-r border-slate-100">
          Reject
        </button>
        <button onClick={(e) => { e.stopPropagation(); onAccept(); }} className="flex-1 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
          Accept Order
        </button>
      </div>
    );
  }

  return (
    <button onClick={(e) => { e.stopPropagation(); onAssign(); }} className="w-full py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
      <Package className="h-4 w-4" />
      {hasAgent ? "Reassign Delivery Boy" : "Assign Delivery Boy"}
    </button>
  );
}
