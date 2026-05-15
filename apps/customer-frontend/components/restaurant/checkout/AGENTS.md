# Checkout Agent Guide

> **Location**: `apps/customer-frontend/components/restaurant/checkout/`
> **Scope**: Checkout flow + live order status tracking
> **Rule**: Poll backend every 5s for REAL status. Never use fake timers.

---

## 1. Checkout Flow

```
Customer adds items → cart (Zustand store)
    ↓
Taps "Place Order"
    ↓
POST /api/v1/orders
    ↓
Backend creates order with status: 'pending'
    ↓
Redirect to /menu/checkout/status/{orderId}
    ↓
Poll GET /orders/:id every 5s
```

---

## 2. Order Status Tracking

**CRITICAL**: The customer frontend must poll the backend for real status.

```typescript
// use-order-status-query.ts
export function useOrderStatusQuery(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiClient<Order>(`/orders/${orderId}`),
    refetchInterval: 5000, // ← 5 seconds
    staleTime: 0,
  });
}
```

### Status → UI Stage Mapping

| OrderStatus | Customer Sees |
|-------------|---------------|
| `pending` | "Order placed" |
| `confirmed` | "Order confirmed ✅" |
| `preparing` | "Preparing your food 🔥" |
| `ready` | "Food is ready 📦" |
| `out_for_delivery` | "On the way 🛵" |
| `completed` | "Delivered! Enjoy your meal ✅" |
| `cancelled` | "Order cancelled ❌" |

---

## 3. Payment

**Customer does NOT select payment at checkout.**
All orders are "pay at doorstep". Driver collects payment.

---

## 4. Required Components (Max 80 Lines)

| Component | Responsibility |
|-----------|---------------|
| `checkout-live-order-status-screen.tsx` | Main tracking page |
| `checkout-order-timeline.tsx` | Visual stepper |
| `checkout-tracking-card.tsx` | Single status card |
| `use-order-status-query.ts` | Poll backend every 5s |

---

## 5. Critical Rules

1. **Never compute status from `Date.now()`** — always read from API.
2. **Poll every 5 seconds** while order is not `completed` or `cancelled`.
3. **Show skeleton** while first fetch is in flight.
4. **Import `OrderStatus` from `@justsearch/types`**.
5. **No component exceeds 80 lines.** Split into smaller files.

---

## 6. Cross-Platform Links

| To | Data Flow |
|-----|-----------|
| backend | `POST /orders` → creates order |
| backend | `GET /orders/:id` → reads real status |

---

End of Checkout Agent Guide.
