import type { IncomingOrder } from "@/lib/hooks/use-order-notification";

export function getIncomingOrderKey(order: IncomingOrder): string {
  return order.orderId || order.assignmentId;
}

export function mergeIncomingOrders(...groups: IncomingOrder[][]): IncomingOrder[] {
  const seen = new Set<string>();
  const merged: IncomingOrder[] = [];

  for (const group of groups) {
    for (const order of group) {
      const key = getIncomingOrderKey(order);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(order);
    }
  }

  return merged;
}
