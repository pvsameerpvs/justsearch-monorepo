import type { IncomingOrder } from "@/lib/hooks/use-order-notification";

export interface RealtimeOrderMessage {
  type: "NEW_ORDER";
  orderId: string;
  orderCode: string;
  customerAddress: string;
  total: number | string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function formatOrderValue(total: number | string): string {
  const amount = Number(total || 0);
  return `AED ${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`;
}

export function parseRealtimeOrderMessage(data: unknown): RealtimeOrderMessage | null {
  if (typeof data !== "string") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed.type !== "NEW_ORDER") return null;

  const orderId = readString(parsed.orderId);
  const orderCode = readString(parsed.orderCode);
  if (!orderId || !orderCode) return null;

  return {
    type: "NEW_ORDER",
    orderId,
    orderCode,
    customerAddress: readString(parsed.customerAddress) || "No address",
    total: typeof parsed.total === "number" ? parsed.total : readString(parsed.total),
  };
}

export function toIncomingOrder(message: RealtimeOrderMessage): IncomingOrder {
  return {
    assignmentId: message.orderId,
    orderId: message.orderId,
    code: message.orderCode,
    customerName: message.customerAddress,
    orderValue: formatOrderValue(message.total),
    etaMinutes: 15,
  };
}
