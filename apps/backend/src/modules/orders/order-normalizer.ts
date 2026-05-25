function toNum(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return 0;
}

function toStr(value: unknown): string | null {
  if (typeof value === 'string') return value || null;
  if (value == null) return null;
  return String(value);
}

function toDateStr(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function normalizeRawOrder(row: Record<string, unknown>): Record<string, unknown> {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    customerName: row.customer_name ?? row.customerName,
    customerPhone: row.customer_phone ?? row.customerPhone,
    subtotal: toNum(row.subtotal),
    deliveryFee: toNum(row.delivery_fee ?? row.deliveryFee),
    tax: toNum(row.tax),
    total: toNum(row.total),
    paymentMode: row.payment_method ?? row.paymentMode ?? null,
    paymentStatus: row.payment_status ?? row.paymentStatus ?? 'unpaid',
    driverId: row.driver_id ?? row.driverId ?? null,
    restaurantId: row.restaurant_id ?? row.restaurantId,
    deliveryAddress: toStr(row.delivery_address ?? row.deliveryAddress),
    notes: toStr(row.notes),
    cancelReason: toStr(row.cancel_reason ?? row.cancelReason),
    alternateNumber: toStr(row.alternate_number ?? row.alternateNumber),
    createdAt: toDateStr(row.created_at ?? row.createdAt),
    updatedAt: toDateStr(row.updated_at ?? row.updatedAt),
    fulfillmentType: row.fulfillment_type ?? row.fulfillmentType ?? 'delivery',
    lat: row.lat ? String(row.lat) : null,
    lng: row.lng ? String(row.lng) : null,
    tableId: row.table_id ?? row.tableId ?? null,
  };
}

export function extractLogoUrl(settings: unknown): string | null {
  if (
    settings &&
    typeof settings === 'object' &&
    'logoUrl' in settings
  ) {
    const url = String((settings as Record<string, unknown>).logoUrl ?? '');
    return url || null;
  }
  return null;
}

export function normalizeRawItem(row: Record<string, unknown>): Record<string, unknown> {
  return {
    id: row.id,
    orderId: row.order_id ?? row.orderId,
    menuItemId: row.menu_item_id ?? row.menuItemId ?? row.id,
    name: row.name,
    quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity ?? 0),
    price: toNum(row.price),
    currency: row.currency ?? 'AED',
  };
}
