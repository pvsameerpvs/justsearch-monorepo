import { broadcastDriverMessage } from '../realtime/delivery-realtime.registry';

type AssignedOrderRow = Record<string, unknown>;

export function broadcastAssignedOrder(
  schemaName: string,
  driverId: string,
  order: AssignedOrderRow
): number {
  const orderId = String(order.id || '');
  const orderCode = String(order.code || '');
  const total = Number(order.total || 0);
  if (!orderId || !orderCode) return 0;

  return broadcastDriverMessage(schemaName, driverId, {
    type: 'NEW_ORDER',
    orderId,
    orderCode,
    customerAddress: String(order.deliveryAddress || 'No address'),
    total: Number.isFinite(total) ? total : 0,
  });
}
