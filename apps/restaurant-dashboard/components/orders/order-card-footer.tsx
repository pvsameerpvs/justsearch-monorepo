import { Package, ChefHat, CheckCircle, Truck, Ban, Check } from "lucide-react";

interface OrderCardFooterProps {
  status: string;
  type: string;
  hasAgent: boolean;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
}

export function OrderCardFooter({ status, type, hasAgent, onAccept, onReject, onAdvance, onAssign }: OrderCardFooterProps) {
  if (status === "pending") {
    return (
      <div className="flex border-t border-slate-100">
        <button onClick={(e) => { e.stopPropagation(); onReject(); }} className="flex-1 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors border-r border-slate-100 flex items-center justify-center gap-1.5">
          <Ban className="h-3.5 w-3.5" />
          Cancel Order
        </button>
        <button onClick={(e) => { e.stopPropagation(); onAccept(); }} className="flex-1 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
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
    if (type === "delivery") {
      return (
        <button onClick={(e) => { e.stopPropagation(); onAssign(); }} className="w-full py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
          <Package className="h-4 w-4" />
          {hasAgent ? "Reassign Delivery Boy" : "Assign Delivery Boy"}
        </button>
      );
    }
    return (
      <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} className="w-full py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
        <CheckCircle className="h-4 w-4" />
        Mark Completed
      </button>
    );
  }

  if (status === "out_for_delivery") {
    return (
      <button onClick={(e) => { e.stopPropagation(); onAdvance(); }} className="w-full py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-100">
        <Truck className="h-4 w-4" />
        Mark Completed
      </button>
    );
  }

  return null;
}
