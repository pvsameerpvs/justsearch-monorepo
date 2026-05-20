const LOCAL_TO_BACKEND: Record<string, string> = {
  order_confirmed: 'confirmed',
  assigned_delivery_boy: 'out_for_delivery',
  delivered: 'completed',
};

export function normalizeStatus(status: string): string {
  return LOCAL_TO_BACKEND[status] || status;
}

const STAGE_ORDER: Record<string, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  ready: 2,
  out_for_delivery: 3,
  completed: 4,
  cancelled: 0,
};

export function getCheckoutStageIndex(status: string): number {
  return STAGE_ORDER[normalizeStatus(status)] ?? 0;
}

export function getActiveCheckoutOrders<T extends { status: string }>(orders: T[]): T[] {
  return orders.filter((o) => {
    const ns = normalizeStatus(o.status);
    return ns !== 'completed' && ns !== 'cancelled';
  });
}
