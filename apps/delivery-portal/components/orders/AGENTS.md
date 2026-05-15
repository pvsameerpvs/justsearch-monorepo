# Driver Orders Agent Guide

> **Location**: `apps/delivery-portal/components/orders/`
> **Scope**: Driver execution — order list, status updates, payment collection
> **Rule**: Single-page app. Poll every 5s. Payment collected at doorstep.

---

## 1. Driver Order Flow

```
Dashboard assigns driver
    ↓
Driver portal polls GET /orders?driverId= every 5s
    ↓
New order appears with status 'out_for_delivery'
    ↓
Driver sees: "Pickup order #JS-1234" + restaurant address + total
    ↓
Driver picks up order (optional tap)
    ↓
Driver navigates to customer address
    ↓
Driver arrives → asks "Cash or Card?"
    ↓
Driver taps 💵 Cash or 💳 Card in app
    ↓
Driver slides "Delivered"
    ↓
PATCH /orders/:id/status → 'completed'
PATCH /orders/:id/payment → { mode: 'cash'|'card' }
    ↓
Order moves to "Completed" section
```

---

## 2. Payment Collection (At Doorstep)

**The driver collects payment. The driver records it.**

```
Driver arrives
    ↓
App shows: "Collect AED {order.total}"
    ↓
Driver asks: "Cash or Card?"
    ↓
Driver taps payment mode:
    ├─ 💵 Cash → payment_mode = 'cash'
    └─ 💳 Card → payment_mode = 'card'
    ↓
Driver slides "Delivered"
    ↓
Payment recorded
```

**Customer never selects payment.** Driver records it.

---

## 3. Status Display

| OrderStatus | Driver Sees | Action |
|-------------|-------------|--------|
| `out_for_delivery` | "Pickup order" | Navigate to restaurant |
| `out_for_delivery` (after pickup) | "Deliver order" | Navigate to customer |
| `completed` | "Delivered ✅" | No action |

---

## 4. Required Hooks

| Hook | Purpose |
|------|---------|
| `useDriverOrdersQuery()` | Poll `GET /orders?driverId=` every 5s |
| `useUpdateDeliveryStatus(orderId, status)` | Call `PATCH /orders/:id/status` |
| `useRecordPayment(orderId, mode)` | Call `PATCH /orders/:id/payment` |

---

## 5. Required Components (Max 80 Lines)

| Component | Responsibility |
|-----------|---------------|
| `driver-home-view.tsx` | Main page: active + completed |
| `driver-current-order-card.tsx` | Active order + payment + deliver |
| `driver-payment-modal.tsx` | 💵 Cash / 💳 Card selection |
| `driver-slide-button.tsx` | Slide to confirm delivery |
| `driver-queue-section.tsx` | Assigned orders list |
| `driver-completed-section.tsx` | Completed deliveries |

---

## 6. Critical Rules

1. **Single-page app.** No navigation needed.
2. **Poll every 5 seconds** while active orders exist.
3. **Payment modal MUST appear** before "Delivered" can be confirmed.
4. **Slide-to-confirm** for all status changes (prevents accidental taps).
5. **Show exact cash amount** when payment mode is cash.
6. **Import `OrderStatus` from `@justsearch/types`**.

---

## 7. Cross-Platform Links

| To | Data Flow |
|-----|-----------|
| backend | `PATCH /orders/:id/status` → marks delivered |
| backend | `PATCH /orders/:id/payment` → records cash/card |
| customer-frontend | Delivery → customer sees "Delivered" |
| dashboard | Payment → dashboard sees badge |

---

End of Driver Orders Agent Guide.
