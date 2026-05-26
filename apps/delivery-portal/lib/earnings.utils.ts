import type { DeliveryOrder } from "@/lib/delivery-types";

export function calculateEarnings(orders: DeliveryOrder[]) {
  const delivered = orders.filter((o) => o.status === "delivered");
  const totalEarned = delivered.reduce((s, o) => s + o.total, 0);
  const cashCollected = delivered.filter((o) => o.paymentMode === "cash_on_delivery").reduce((s, o) => s + o.total, 0);
  const cardCollected = delivered.filter((o) => o.paymentMode === "prepaid").reduce((s, o) => s + o.total, 0);

  return {
    totalDeliveries: delivered.length,
    totalEarned,
    cashCollected,
    cardCollected,
  };
}
