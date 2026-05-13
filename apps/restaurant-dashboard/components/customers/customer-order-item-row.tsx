import { Package } from "lucide-react";
import type { OrderItem } from "@/lib/stores/order-store";

interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white border border-slate-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-slate-400" />
        <div>
          <p className="text-xs font-bold text-slate-900">{item.name}</p>
          {item.notes && <p className="text-[10px] text-slate-500">{item.notes}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-slate-900">x{item.quantity}</p>
        <p className="text-[10px] text-slate-500">AED {item.price}</p>
      </div>
    </div>
  );
}
