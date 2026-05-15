export const ORDER_PLACING_DURATION_MS = 1800;

export function getCheckoutLineTotal(item: { price: number; quantity: number; lineTotal?: number }): number {
  return typeof item.lineTotal === 'number' ? item.lineTotal : item.price * item.quantity;
}
