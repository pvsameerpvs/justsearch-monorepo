import type { Order, OrderItem } from '@justsearch/types';
import type { DeliveryOrder, StoredCartItem } from '../../use-restaurant-fulfillment';

export function mapOrderToDeliveryOrder(
  order: Order,
  items: OrderItem[],
  fallbackCurrency = 'AED'
): DeliveryOrder {
  const mappedItems: StoredCartItem[] = items.map((item) => ({
    itemId: item.menuItemId || item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    currency: item.currency || fallbackCurrency,
  }));

  return {
    id: order.id,
    createdAt: new Date(order.createdAt).getTime(),
    items: mappedItems,
    address: order.deliveryAddress || '',
    note: order.notes || '',
    riderName: '',
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    status: order.status as DeliveryOrder['status'],
    cancelReason: order.cancelReason || undefined,
  };
}
