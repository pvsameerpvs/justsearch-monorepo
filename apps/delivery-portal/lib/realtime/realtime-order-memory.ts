const ALERT_MEMORY_MS = 60_000;
const alertedOrders = new Map<string, number>();

function pruneExpired(now: number) {
  for (const [orderId, expiresAt] of alertedOrders) {
    if (expiresAt <= now) alertedOrders.delete(orderId);
  }
}

export function rememberRealtimeOrder(orderId: string) {
  const now = Date.now();
  pruneExpired(now);
  alertedOrders.set(orderId, now + ALERT_MEMORY_MS);
}

export function wasRecentlyRealtimeOrder(orderId: string): boolean {
  const now = Date.now();
  pruneExpired(now);
  return (alertedOrders.get(orderId) || 0) > now;
}
