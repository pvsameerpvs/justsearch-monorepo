import { Phone, MapPin, Clock, CreditCard, ChevronRight } from "lucide-react";
import { formatTime } from "./time-utils";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderCardMetaProps {
  order: DashboardOrder;
}

export function OrderCardMeta({ order }: OrderCardMetaProps) {
  const isDelivery = order.type === "delivery";
  const itemPreview = Array.isArray(order.orderItems) ? order.orderItems.slice(0, 3).map((i) => i.name).join(" · ") : "";
  const hasMoreItems = (Array.isArray(order.orderItems) ? order.orderItems.length : order.items) > 3;

  return (
    <div className="mt-3">
      {itemPreview && (
        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-1">
          {itemPreview}{hasMoreItems ? <span className="text-slate-400"> + more</span> : ""}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MetaPill icon={<Phone className="h-3 w-3" />} text={order.customerPhone} />
        {isDelivery && <MetaPill icon={<MapPin className="h-3 w-3" />} text={order.address} truncate />}
        <MetaPill icon={<Clock className="h-3 w-3" />} text={formatTime(order.createdAt)} />
        <MetaPill icon={<CreditCard className="h-3 w-3" />} text={order.paymentMethod} />
      </div>
    </div>
  );
}

function MetaPill({ icon, text, truncate }: { icon: React.ReactNode; text: string; truncate?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 ${truncate ? "max-w-[160px] truncate" : ""}`}>
      {icon}
      <span className={truncate ? "truncate" : ""}>{text}</span>
    </span>
  );
}
