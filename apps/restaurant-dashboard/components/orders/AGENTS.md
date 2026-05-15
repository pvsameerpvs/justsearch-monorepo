# Order Management Agent Guide

> **Location**: `apps/restaurant-dashboard/components/orders/`
> **Scope**: Order list, status buttons, driver assignment, payment badges
> **Rule**: Poll backend every 10s. Play sound on new order.

---

## 1. Status Button Pipeline

| Current Status | Button Action | Next Status | API Call |
|---------------|--------------|-------------|----------|
| `pending` | "Accept" | `confirmed` | `PATCH /orders/:id/status` |
| `confirmed` | "Preparing" | `preparing` | `PATCH /orders/:id/status` |
| `preparing` | "Ready" | `ready` | `PATCH /orders/:id/status` |
| `ready` | "Assign Driver" | `out_for_delivery` | `PATCH /orders/:id/driver` + `PATCH /orders/:id/status` |
| `out_for_delivery` | "Complete" | `completed` | `PATCH /orders/:id/status` |

---

## 2. Driver Assignment

```
Staff clicks "Assign Driver"
    ↓
Opens DeliveryBoyPicker modal
    ↓
Shows available drivers from delivery_agents table
    ↓
Staff selects driver
    ↓
PATCH /orders/:id/driver → { driverId }
    ↓
Backend sets: driver_id + status = 'out_for_delivery'
    ↓
Driver portal gets alert (next poll cycle)
```

---

## 3. Payment Badges

Completed orders show what driver collected:

| Badge | Condition |
|-------|-----------|
| 💵 Cash | `paymentMode === 'cash'` && `status === 'completed'` |
| 💳 Card | `paymentMode === 'card'` && `status === 'completed'` |
| ⏳ | `status !== 'completed'` |

---

## 4. Required Hooks

| Hook | Purpose |
|------|---------|
| `useOrdersQuery()` | Poll `GET /orders` every 10s |
| `useAssignDriver(orderId, driverId)` | Call `PATCH /orders/:id/driver` |

---

## 5. Required Components (Max 80 Lines)

| Component | Responsibility |
|-----------|---------------|
| `order-manager.tsx` | Order list + tabs + filters |
| `order-card.tsx` | Single order card + status + payment badge |
| `order-detail-drawer.tsx` | Slide-out details + actions |
| `delivery-boy-picker.tsx` | Driver assignment modal |
| `orders.utils.ts` | `mapApiOrderToDashboard()` helper |

---

## 6. Critical Rules

1. **Poll every 10 seconds** for real-time orders.
2. **Play sound notification** when `pending` order arrives.
3. **Assign driver via API** — not just local Zustand store.
4. **Show payment badges only** when `status === 'completed'`.
5. **Import `OrderStatus` from `@justsearch/types`**.

---

## 7. Cross-Platform Links

| To | Data Flow |
|-----|-----------|
| backend | `PATCH /orders/:id/status` → updates order |
| backend | `PATCH /orders/:id/driver` → assigns driver |
| delivery-portal | Assignment → driver sees order |
| customer-frontend | Status update → customer sees progress |

---

End of Order Management Agent Guide.
