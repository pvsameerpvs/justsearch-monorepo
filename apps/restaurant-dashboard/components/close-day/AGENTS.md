# Close of Day Agent Guide

> **Location**: `apps/restaurant-dashboard/components/close-day/`
> **Scope**: Daily closeout — cash total, card total, order count, grand total
> **Rule**: Aggregates only `completed` orders with `paymentMode` set.

---

## 1. Close-of-Day Flow

```
End of shift → Staff taps "Close Day"
    ↓
Dashboard calculates from today's completed orders:
    ├─ Cash total:  sum(total) WHERE payment_mode = 'cash'
    ├─ Card total:  sum(total) WHERE payment_mode = 'card'
    ├─ Order count: count(*) WHERE status = 'completed'
    └─ Grand total: cash + card
    ↓
Staff reviews totals
    ↓
Staff taps "Confirm Close"
    ↓
POST /api/v1/close-day
    ↓
Backend saves to daily_closeouts table
    ↓
Counters reset for next day
```

---

## 2. API

```typescript
// Create closeout
POST /api/v1/close-day
  Body: { date: '2026-05-15' }

// Fetch closeout history
GET /api/v1/close-day?date=2026-05-15
GET /api/v1/close-day?startDate=&endDate=
```

---

## 3. Required Components (Max 80 Lines)

| Component | Responsibility |
|-----------|---------------|
| `close-day-container.tsx` | Page layout + totals + close button |
| `close-day-summary-card.tsx` | Cash | Card | Orders | Grand |
| `close-day-history.tsx` | Past closeouts list |

---

## 4. Critical Rules

1. **Only count `completed` orders**.
2. **Only include orders with `paymentMode` set** (cash or card).
3. **Show confirmation modal** before finalizing.
4. **Display history** for past days.
5. **Import `OrderStatus` from `@justsearch/types`**.

---

End of Close of Day Agent Guide.
