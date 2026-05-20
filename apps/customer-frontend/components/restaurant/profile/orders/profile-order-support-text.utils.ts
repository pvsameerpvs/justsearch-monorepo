import type { OrderStatus } from '@justsearch/types';
import { formatOrderCompletionTime } from './profile-order-date.utils';

export function getOrderSummarySupportText(order: { status: string; id: string; createdAt: number | string; cancelReason?: string }) {
  switch (order.status as OrderStatus | string) {
    case 'completed':
    case 'delivered':
      return `Your order was completed at ${formatOrderCompletionTime(order.createdAt)}.`;
    case 'out_for_delivery':
    case 'assigned_delivery_boy':
      return `Your delivery partner is heading to your location with order #${order.id}.`;
    case 'preparing':
      return `The kitchen is preparing order #${order.id}.`;
    case 'ready':
      return `Order #${order.id} is packed and ready for pickup.`;
    case 'cancelled': {
      const reason = order.cancelReason?.trim();
      return reason ? `This order has been cancelled: ${reason}` : 'This order has been cancelled.';
    }
    case 'confirmed':
    case 'order_confirmed':
    case 'pending':
    default:
      return `The restaurant is preparing order #${order.id} and will update delivery soon.`;
  }
}
