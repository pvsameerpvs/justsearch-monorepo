import { Package, ChefHat, CheckCircle, Truck, Ban, Check, ArrowRight } from "lucide-react";

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
      <div className="flex border-t border-slate-100/80">
        <button
          onClick={(e) => { e.stopPropagation(); onReject(); }}
          className="group flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50/80 transition-colors border-r border-slate-100/80 flex items-center justify-center gap-1.5"
        >
          <Ban className="h-4 w-4 transition-transform group-hover:scale-110" />
          Cancel Order
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAccept(); }}
          className="group flex-1 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
          Accept Order
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onAdvance(); }}
        className="group w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-500/15"
      >
        <ChefHat className="h-4 w-4" />
        Start Preparing
        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  if (status === "preparing") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onAdvance(); }}
        className="group w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-violet-500/15"
      >
        <CheckCircle className="h-4 w-4" />
        Mark Ready
        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  if (status === "ready") {
    if (type === "delivery") {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); onAssign(); }}
          className="group w-full py-3 text-sm font-bold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all flex items-center justify-center gap-2 border-t border-slate-100/80"
        >
          <Package className="h-4 w-4" />
          {hasAgent ? "Reassign Delivery Boy" : "Assign Delivery Boy"}
          <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </button>
      );
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onAdvance(); }}
        className="group w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/15"
      >
        <CheckCircle className="h-4 w-4" />
        Mark Completed
        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  if (status === "out_for_delivery") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onAdvance(); }}
        className="group w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/15"
      >
        <Truck className="h-4 w-4" />
        Mark Completed
        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  return null;
}
