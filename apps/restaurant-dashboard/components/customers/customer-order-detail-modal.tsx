import { X, Phone, CreditCard } from "lucide-react";
import { OrderStatusBadge } from "./customer-order-status-badge";
import { OrderItemRow } from "./customer-order-item-row";
import { OrderTotals } from "./customer-order-totals";
import { OrderTimeline } from "./customer-order-timeline";
import { OrderAddressBlock } from "./customer-order-address-block";
import { InfoItem } from "./customer-detail-info-item";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface CustomerOrderDetailModalProps {
  order: DashboardOrder | null;
  onClose: () => void;
}

export function CustomerOrderDetailModal({ order, onClose }: CustomerOrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="elegant-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-sm font-bold text-slate-900">{order.code}</p>
              <p className="text-xs text-slate-500">{order.createdAt.slice(0, 16).replace("T", " ")}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-slate-500 capitalize">{order.type.replace("_", " ")}</span>
          </div>

          <OrderAddressBlock address={order.address} />

          <div className="grid grid-cols-2 gap-3">
            <InfoItem icon={Phone} label="Phone" value={order.customerPhone} />
            <InfoItem icon={CreditCard} label="Payment" value={order.paymentMethod} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Order Items ({order.orderItems.length})
            </p>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <OrderTotals
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            tax={order.tax}
            total={order.total}
          />

          <OrderTimeline timeline={order.timeline} />
        </div>
      </div>
    </div>
  );
}
