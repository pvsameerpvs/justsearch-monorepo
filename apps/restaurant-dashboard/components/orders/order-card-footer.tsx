import { Package, ChefHat, CheckCircle, Truck } from "lucide-react";
import { OrderActionButton } from "./order-action-button";
import { OrderSplitActions } from "./order-split-actions";

interface OrderCardFooterProps {
  status: string;
  type: string;
  hasAgent: boolean;
  isPending: boolean;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
}

export function OrderCardFooter({ status, type, hasAgent, isPending, onAccept, onReject, onAdvance, onAssign }: OrderCardFooterProps) {
  const stopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  if (status === "pending") {
    return <OrderSplitActions disabled={isPending} onReject={stopPropagation(onReject)} onAccept={stopPropagation(onAccept)} />;
  }

  if (status === "confirmed") {
    return (
      <OrderActionButton
        disabled={isPending}
        onClick={stopPropagation(onAdvance)}
        icon={<ChefHat className="h-4 w-4" />}
        label="Start Preparing"
        gradient="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/15"
      />
    );
  }

  if (status === "preparing") {
    return (
      <OrderActionButton
        disabled={isPending}
        onClick={stopPropagation(onAdvance)}
        icon={<CheckCircle className="h-4 w-4" />}
        label="Mark Ready"
        gradient="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-violet-500/15"
      />
    );
  }

  if (status === "ready") {
    if (type === "delivery") {
      return (
        <OrderActionButton
          disabled={isPending}
          onClick={stopPropagation(onAssign)}
          icon={<Package className="h-4 w-4" />}
          label={hasAgent ? "Reassign Delivery Boy" : "Assign Delivery Boy"}
          borderTop
        />
      );
    }
    return (
      <OrderActionButton
        disabled={isPending}
        onClick={stopPropagation(onAdvance)}
        icon={<CheckCircle className="h-4 w-4" />}
        label="Mark Completed"
        gradient="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/15"
      />
    );
  }

  if (status === "out_for_delivery") {
    return (
      <OrderActionButton
        disabled={isPending}
        onClick={stopPropagation(onAdvance)}
        icon={<Truck className="h-4 w-4" />}
        label="Mark Completed"
        gradient="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/15"
      />
    );
  }

  return null;
}
