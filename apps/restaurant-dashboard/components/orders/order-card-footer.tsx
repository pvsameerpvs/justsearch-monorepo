import { Package, ChefHat, CheckCircle } from "lucide-react";

interface OrderCardFooterProps {
  status: string;
  hasAgent: boolean;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
}

export function OrderCardFooter({ status, hasAgent, onAccept, onReject, onAdvance, onAssign }: OrderCardFooterProps) {
  if (status === "pending") {
    return (
      <div className="flex border-t border-slate-100">
        <button onClick={(e) => { e.stopPropagation(); onReject(); }} className="flex-1 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors border-r border-slate-100">
          Reject
        </button>
        <button onClick={(e) => { e.stopPropagation(); onAccept(); }} className="flex-1 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
          Accept Order
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} className="w-full py-3 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
        <ChefHat className="h-4 w-4" />
        Start Preparing
      </button>
    );
  }

  if (status === "preparing") {
    return (
      <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} className="w-full py-3 text-sm font-semibold text-white bg-violet-500 hover:bg-violet-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
        <CheckCircle className="h-4 w-4" />
        Mark Ready
      </button>
    );
  }

  if (status === "ready") {
    return (
      <button onClick={(e) => { e.stopPropagation(); onAssign(); }} className="w-full py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
        <Package className="h-4 w-4" />
        {hasAgent ? "Reassign Delivery Boy" : "Assign Delivery Boy"}
      </button>
    );
  }

  return null;
}
