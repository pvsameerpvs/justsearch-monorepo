import { ShoppingBag, UtensilsCrossed, Package } from "lucide-react";

const TYPE_ICON: Record<string, React.ReactNode> = {
  delivery: <ShoppingBag className="h-3 w-3" />,
  dine_in: <UtensilsCrossed className="h-3 w-3" />,
  pickup: <Package className="h-3 w-3" />,
};

const TYPE_LABEL: Record<string, string> = {
  delivery: "Delivery",
  dine_in: "Dine In",
  pickup: "Pickup",
};

const TYPE_COLOR: Record<string, string> = {
  delivery: "bg-blue-50 text-blue-700 border-blue-200",
  dine_in: "bg-rose-50 text-rose-700 border-rose-200",
  pickup: "bg-teal-50 text-teal-700 border-teal-200",
};

interface OrderTypeBadgeProps {
  type: string;
}

export function OrderTypeBadge({ type }: OrderTypeBadgeProps) {
  return (
    <span className={`status-chip border text-[10px] ${TYPE_COLOR[type] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {TYPE_ICON[type]} {TYPE_LABEL[type] || type}
    </span>
  );
}
