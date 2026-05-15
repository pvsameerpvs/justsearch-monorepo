import type { DashboardOrder, OrderStatus } from "@/lib/stores/order-store";
import type { ApiOrder } from "@/lib/hooks/use-orders-query";

export function mapApiOrderToDashboard(o: ApiOrder): DashboardOrder {
  return {
    id: o.id,
    code: o.code,
    status: o.status as OrderStatus,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items: 0,
    total: Number(o.total),
    subtotal: Number(o.total),
    deliveryFee: 0,
    tax: 0,
    type: 'delivery',
    address: '',
    paymentMethod: 'cod',
    assignedAgentId: null,
    createdAt: o.createdAt,
    orderItems: [],
    timeline: [],
  };
}
