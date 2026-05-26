import { ShoppingBag, UtensilsCrossed, Package } from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; gradient: string; icon: React.ElementType }> = {
  delivery: { label: "Delivery", gradient: "from-blue-400 to-indigo-500", icon: ShoppingBag },
  dine_in: { label: "Dine In", gradient: "from-rose-400 to-pink-500", icon: UtensilsCrossed },
  pickup: { label: "Pickup", gradient: "from-teal-400 to-emerald-500", icon: Package },
};

interface OrderTypeBadgeProps {
  type: string;
}

export function OrderTypeBadge({ type }: OrderTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/60 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm">
      <div className={`flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} text-white`}>
        <Icon className="h-2 w-2" />
      </div>
      {config.label}
    </span>
  );
}
