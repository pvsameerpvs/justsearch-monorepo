export function getCheckoutStageIndex(status: string): number {
  const stageMap: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    preparing: 1,
    ready: 1,
    out_for_delivery: 2,
    completed: 3,
    cancelled: 0,
  };
  return stageMap[status] ?? 0;
}

export type CheckoutLiveStage = {
  id: string;
  label: string;
  description: string;
};

export function getCheckoutLiveStages(riderName: string): CheckoutLiveStage[] {
  return [
    { id: 'accepted', label: 'Order accepted', description: 'The restaurant confirmed your order.' },
    { id: 'ready', label: 'Order ready', description: 'Your food is packed and waiting.' },
    { id: 'assigned', label: 'Delivery assigned', description: `${riderName} is heading to pick up your order.` },
    { id: 'completed', label: 'Delivery completed', description: 'Your order was delivered successfully.' },
  ];
}

// Legacy exports for backward compatibility
export type CheckoutActiveOrderSummary = {
  id: string;
  progress: number;
  isOnTheWay: boolean;
};

export function getActiveCheckoutOrders<T extends { status: string }>(orders: T[], _now?: number): T[] {
  return orders.filter((order) => order.status !== 'completed' && order.status !== 'cancelled');
}

export function getCheckoutOrderSummaries(orders: { id: string; status: string }[]): CheckoutActiveOrderSummary[] {
  return getActiveCheckoutOrders(orders)
    .map((order) => ({
      id: order.id,
      progress: 0.5,
      isOnTheWay: order.status === 'out_for_delivery',
    }));
}

export function getCheckoutStatusHref(orderIds: string[]) {
  if (orderIds.length === 0) return null;
  if (orderIds.length > 1) return '/menu/checkout/status';
  return `/menu/checkout/status/${encodeURIComponent(orderIds[0])}`;
}
