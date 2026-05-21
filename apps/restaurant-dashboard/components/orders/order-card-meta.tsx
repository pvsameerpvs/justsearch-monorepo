import { Phone, MapPin, Clock, CreditCard } from "lucide-react";
import { formatTime } from "./time-utils";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderCardMetaProps {
  order: DashboardOrder;
}

export function OrderCardMeta({ order }: OrderCardMetaProps) {
  const isDelivery = order.type === "delivery";
  const itemPreview = order.orderItems?.slice(0, 2).map((i) => i.name).join(", ") || "";
  const hasMoreItems = (order.orderItems?.length || order.items) > 2;

  return (
    <>
      {itemPreview && (
        <p className="mt-2 text-xs text-slate-500 line-clamp-1">
          {itemPreview}{hasMoreItems ? " + more" : ""}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.customerPhone}</span>
        {isDelivery && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.address}</span>}
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(order.createdAt)}</span>
        <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {order.paymentMethod}</span>
      </div>
    </>
  );
}
