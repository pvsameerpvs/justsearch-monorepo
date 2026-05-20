import type { OrderStatus } from "@/lib/stores/order-store";

export function getNextStatus(status: string, type: string): OrderStatus | null {
  if (status === "confirmed") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready" && type !== "delivery") return "completed";
  if (status === "out_for_delivery") return "completed";
  return null;
}
