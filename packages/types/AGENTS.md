# Common Types Agent Guide

> **Package**: `packages/types`
> **Scope**: Single source of truth for ALL shared TypeScript contracts
> **Rule**: Every app imports from here. Never define your own duplicate.

---

## 1. Order Status Enum

```typescript
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';
```

**Used by**: backend (DB schema), customer-frontend (status display), dashboard (status buttons), delivery-portal (driver actions).

### Labels
```typescript
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order placed',
  confirmed: 'Order confirmed',
  preparing: 'Preparing your food',
  ready: 'Ready for pickup',
  out_for_delivery: 'On the way',
  completed: 'Delivered',
  cancelled: 'Cancelled',
};
```

### Stage Index (for visual stepper)
```typescript
export const ORDER_STATUS_STAGE: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  ready: 1,
  out_for_delivery: 2,
  completed: 3,
  cancelled: 0,
};
```

---

## 2. Payment Types

```typescript
export type PaymentMode = 'cash' | 'card';
export type PaymentStatus = 'unpaid' | 'paid';

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'Cash',
  card: 'Card',
};
```

**Used by**: backend (orders table), delivery-portal (driver records payment), dashboard (close-of-day aggregation).

---

## 3. Shared Order Interface

```typescript
export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode | null;
  paymentStatus: PaymentStatus;
  driverId: string | null;
  restaurantId: string;
  deliveryAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Golden Rule

**If you are tempted to define `type OrderStatus = ...` in any app — STOP.**

Import from `@justsearch/types`:

```typescript
import type { OrderStatus, PaymentMode, Order } from '@justsearch/types';
```

---

## 5. File Structure

```
packages/types/
  ├── index.ts        # All exports
  ├── package.json    # @justsearch/types
  ├── tsconfig.json
  └── AGENTS.md       # This file
```

---

End of Common Types Agent Guide.
