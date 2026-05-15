# Order Module Agent Guide

> **Location**: `apps/backend/src/modules/orders/`
> **Scope**: Order API routes — status pipeline, driver assignment, payment, close-of-day
> **Rule**: Every query filters by `req.tenant.id`.

---

## 1. Order Status Pipeline

```
pending → confirmed → preparing → ready → out_for_delivery → completed
```

| Status | Set By | API |
|--------|--------|-----|
| `pending` | Backend | `POST /orders` |
| `confirmed` | Dashboard | `PATCH /orders/:id/status` |
| `preparing` | Dashboard | `PATCH /orders/:id/status` |
| `ready` | Dashboard | `PATCH /orders/:id/status` |
| `out_for_delivery` | Dashboard | `PATCH /orders/:id/driver` |
| `completed` | Driver | `PATCH /orders/:id/status` |
| `cancelled` | Dashboard | `PATCH /orders/:id/status` |

---

## 2. API Routes

```typescript
// Create order (customer-frontend)
POST   /api/v1/orders

// List orders (dashboard)
GET    /api/v1/orders

// List MY orders (delivery-portal)
GET    /api/v1/orders?driverId=:driverId

// Track single order (customer-frontend)
GET    /api/v1/orders/:id

// Update status (dashboard + driver)
PATCH  /api/v1/orders/:id/status

// Assign driver (dashboard)
PATCH  /api/v1/orders/:id/driver

// Record payment (driver at doorstep)
PATCH  /api/v1/orders/:id/payment

// Daily closeout (dashboard)
POST   /api/v1/close-day
GET    /api/v1/close-day?date=
```

---

## 3. Database Schema

```typescript
orders
  - id (uuid, pk)
  - restaurant_id (uuid, fk)
  - code (varchar)            // JS-XXXX
  - status (order_status)     // pending..completed
  - customer_id (uuid)
  - customer_name (varchar)
  - customer_phone (varchar)
  - subtotal (decimal)
  - delivery_fee (decimal)
  - tax (decimal)
  - total (decimal)
  - driver_id (uuid, nullable)      // ← assigned driver
  - payment_mode (payment_mode, nullable) // ← cash | card
  - payment_status (payment_status)   // unpaid | paid
  - delivery_address (text)
  - notes (text)
  - created_at (timestamp)
  - updated_at (timestamp)

daily_closeouts
  - id (uuid, pk)
  - restaurant_id (uuid, fk)
  - date (date)
  - cash_total (decimal)
  - card_total (decimal)
  - order_count (integer)
  - grand_total (decimal)
  - closed_by (uuid)
  - closed_at (timestamp)
```

---

## 4. Critical Rules

1. **Tenant filter on EVERY query**: `eq(orders.restaurantId, req.tenant.id)`
2. **Zod validation** on all request bodies
3. **Auth middleware** on all routes
4. **Role checks**: `requireRole()` for dashboard actions
5. **Import `OrderStatus` from `@justsearch/types`** — never hardcode strings

---

## 5. File Structure

```
src/modules/orders/
  ├── order.routes.ts      # Route definitions (max 80 lines → split if needed)
  ├── order.services.ts    # DB query helpers
  ├── order.validators.ts  # Zod schemas
  └── AGENTS.md            # This file
```

---

End of Order Module Agent Guide.
