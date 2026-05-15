# Restaurant Dashboard Agent Guide

> **App**: `apps/restaurant-dashboard`
> **Domain**: `[restaurant]-admin.mydomain.com`
> **Type**: Next.js App Router (RSC + Client Components)
> **Scope**: Restaurant owner/staff POS & operations portal

This agent handles all restaurant staff functionality: order management, menu editing, voucher creation, delivery assignment, analytics, and settings.

---

## 1. Architecture Overview

```
Request Flow:
subdomain (mosaic-table-admin.mydomain.com)
    → middleware.ts (extracts subdomain, strips "-admin" suffix)
    → layout.tsx (async RootLayout)
        → getCurrentRestaurant() (RSC, caches per request)
            → Tries: GET /api/v1/restaurants/current (backend)
            → Falls back: mock data
    → ClientLayout (sidebar + auth guard)
        → children (page content)
```

**Key principle**: This is an operational dashboard, not a public site. Speed and clarity over decoration.

---

## 2. Golden Rules

1. **Operational speed first.** Every action should be executable in 2 taps or less.
2. **Orders are the homepage.** The dashboard opens to active orders, not a decorative dashboard.
3. **Real-time updates.** Orders must auto-refresh. Use polling or WebSocket.
4. **Role-based access.** Owner sees everything. Manager sees orders + menu. Kitchen sees only preparing queue. Cashier sees POS.
5. **Touch + keyboard friendly.** Staff may use tablets or desktops. Design for both.
6. **All changes audit-logged.** Menu updates, price changes, status changes → `audit_logs` table.
7. **Never lose an order.** Status changes must be atomic with database transaction.

---

## 3. File Structure Standards

```
app/
├── page.tsx                    # Dashboard home (redirects to /orders)
├── layout.tsx                  # Root layout: sidebar + auth guard + restaurant context
├── loading.tsx                 # Skeleton loader
├── error.tsx                   # Error boundary
├── login/
│   └── page.tsx                # Staff login (username + password)
├── orders/
│   └── page.tsx                # Order manager (list + filters + actions)
├── menu/
│   └── page.tsx                # Menu editor (categories + items)
├── delivery/
│   └── page.tsx                # Delivery agents + assignments
├── customers/
│   └── page.tsx                # Customer list + loyalty
├── vouchers/
│   └── page.tsx                # Promo code manager
├── analytics/
│   └── page.tsx                # Revenue + game + ad analytics
├── settings/
│   └── page.tsx                # Restaurant settings + QR codes
├── homepage/
│   └── page.tsx                # Public homepage editor
└── profile/
    └── page.tsx                # Staff profile

components/
├── dashboard-sidebar.tsx       # Left navigation rail
├── client-layout.tsx           # Wraps pages with sidebar + auth
├── auth-guard.tsx              # Redirects to /login if not authenticated
├── dashboard/
│   ├── welcome-bar.tsx         # Restaurant name + date
│   ├── quick-actions.tsx       # Shortcuts (New Order, Add Menu Item)
│   ├── dashboard-stats.tsx     # Revenue + order count today
│   ├── top-menu-items.tsx      # Best sellers
│   └── recent-orders.tsx       # Last 5 orders
├── orders/
│   ├── order-manager.tsx       # Main order grid
│   ├── order-manager-filters.tsx
│   ├── order-manager-tabs.tsx  # All / Pending / Preparing / Ready / Completed
│   ├── order-card.tsx          # Single order card
│   ├── order-card-footer.tsx   # Actions (Accept / Ready / Assign)
│   ├── order-detail-drawer.tsx # Slide-out order details
│   ├── order-detail-header.tsx
│   ├── order-items-list.tsx
│   ├── order-totals.tsx
│   ├── order-status-stepper.tsx
│   ├── order-timeline.tsx
│   ├── delivery-boy-picker.tsx # Assign driver
│   └── use-order-manager.ts    # Hook: fetch, filter, update
├── menu/
│   ├── category-editor.tsx     # CRUD menu categories
│   ├── category-header.tsx
│   ├── menu-item-card.tsx      # Item display
│   ├── menu-item-row.tsx       # Compact item row
│   ├── item-editor-modal.tsx   # Add/edit item form
│   ├── item-form-fields.tsx
│   └── menu-item-actions.tsx   # Toggle availability, delete
├── delivery/
│   ├── driver-edit-form.tsx    # Add/edit delivery agent
│   └── delivery-agent-form.tsx
├── vouchers/
│   ├── voucher-manager.tsx     # List + create vouchers
│   ├── voucher-card.tsx
│   ├── voucher-form-modal.tsx
│   └── ...
├── settings/
│   ├── settings-container.tsx
│   ├── settings-profile-card.tsx
│   ├── settings-contact-card.tsx
│   ├── settings-socials-card.tsx
│   ├── settings-qr-card.tsx
│   └── settings-domain-card.tsx
└── analytics/
    ├── analytics-dashboard.tsx
    ├── analytics-cards.tsx
    └── revenue-breakdown-panel.tsx

lib/
├── get-current-restaurant.ts   # Subdomain → restaurant
├── api.ts                      # API client with auth token
└── auth-store.ts               # Zustand: staff auth state
```

---

## 4. Component Rules (Max 80 Lines)

| Type | Max Lines | Notes |
|------|-----------|-------|
| Page | 30 | Mostly data fetch + layout delegation |
| Container | 60 | State + business logic |
| Presenter | 50 | Props-only, no logic |
| Card | 40 | Order card, menu item card |
| List | 50 | Order grid, menu list |
| Form | 60 | Item editor, driver form |
| Modal | 50 | Voucher modal, item modal |
| Table | 60 | Analytics tables |

---

## 5. Auth & Role Model

### 5.1 Login Flow
```
1. Staff opens [restaurant]-admin.mydomain.com/login
2. Enters username + password
3. Frontend calls POST /api/v1/auth/login
   → Body: { username, password, type: 'staff' }
   → Backend checks staff table (restaurantId + username)
   → If valid: returns JWT with { userId, role, restaurantId, type: 'staff' }
   → Frontend sets cookie
4. AuthGuard checks cookie on every page
   → If missing: redirect to /login
   → If present: decode role, render appropriate UI
```

### 5.2 Role Permissions
| Role | Can See | Can Do |
|------|---------|--------|
| **owner** | Everything | Everything + create staff + billing |
| **manager** | Orders, Menu, Delivery, Vouchers, Customers, Analytics | Manage orders, edit menu, assign drivers, create vouchers |
| **cashier** | Orders, POS | Accept payments, update order status |
| **kitchen_staff** | Orders (preparing/ready only) | Mark orders as preparing / ready |

### 5.3 UI Adaptation by Role
```typescript
const { role } = useAuthStore();

// Hide admin-only features
{role === 'owner' && <BillingSettings />}

// Disable restricted actions
<Button disabled={role !== 'manager' && role !== 'owner'}>
  Delete Item
</Button>
```

---

## 6. Order Management Rules

### 6.1 Status Flow (Immutable Sequence)
```
pending → confirmed → preparing → ready → out_for_delivery → completed
         ↑           ↑          ↑
      cashier     kitchen    kitchen/manager
```

**No skipping:** Cannot go from `pending` → `ready`. Must pass through `confirmed` and `preparing`.

**Cancellation:** Only `pending` or `confirmed` can be cancelled.

### 6.2 Auto-Refresh
Order list must refresh every 10 seconds:
```typescript
useEffect(() => {
  const interval = setInterval(refetchOrders, 10000);
  return () => clearInterval(interval);
}, []);
```

### 6.3 Sound Notifications
Play sound when new order arrives (status = `pending` and not yet seen):
```typescript
// use-order-sound.ts
useEffect(() => {
  const newOrders = orders.filter(o => o.status === 'pending' && !seen.has(o.id));
  if (newOrders.length > 0) playNotificationSound();
}, [orders]);
```

---

## 7. Menu Management Rules

### 7.1 Item Availability
- Toggle `isAvailable` without reload
- Show "Out of Stock" badge immediately
- Persist change to backend: `PATCH /api/v1/menu-items/:id`

### 7.2 Price Changes
- Must be logged to `audit_logs` table
- Show confirmation: "This price change will be visible immediately. Continue?"

### 7.3 Category Reordering
- Drag-and-drop to reorder categories
- Backend stores `sortOrder` integer
- Reorder requires updating multiple rows (transaction)

---

## 8. API Integration

### 8.1 Required Headers
```typescript
fetch(`${API_BASE}/endpoint`, {
  headers: {
    'Content-Type': 'application/json',
    'host': window.location.host,
  },
  credentials: 'include',
});
```

### 8.2 Backend Endpoints (Status)
| Endpoint | Status | Usage |
|---|---|---|
| `POST /api/v1/auth/login` | ❌ Not ready | Staff login (backend returns 501 — needs staff table lookup) |
| `GET /api/v1/auth/me` | ✅ Ready | Profile |
| `GET /api/v1/orders` | ✅ Ready | Order list |
| `PATCH /api/v1/orders/:id/status` | ✅ Ready | Update status |
| `GET /api/v1/menus` | ✅ Ready | Menu data |
| `PATCH /api/v1/menu-items/:id` | ❌ Not ready | Update item |
| `POST /api/v1/menu-items` | ❌ Not ready | Create item |
| `POST /api/v1/delivery-agents` | ❌ Not ready | Add driver |
| `GET /api/v1/delivery-agents` | ❌ Not ready | Driver list |
| `POST /api/v1/vouchers` | ❌ Not ready | Create voucher |
| `GET /api/v1/vouchers` | ❌ Not ready | Voucher list |

---

## 9. Build Checklist

- [ ] No component exceeds 80 lines
- [ ] All API calls use `credentials: 'include'`
- [ ] Role-based UI rendering (no admin features for kitchen staff)
- [ ] Order status transitions validated (no skipping)
- [ ] Auto-refresh implemented (10s polling)
- [ ] Sound notifications for new orders
- [ ] Mobile responsive (staff may use tablets)
- [ ] Keyboard shortcuts for common actions (Enter to accept, Esc to close)
- [ ] `tsc --noEmit` passes
- [ ] No `console.log`

---

## 10. Cross-Platform Links (How Restaurant Dashboard Connects to Other Portals)

### Link 1: justsearch-admin → restaurant-dashboard
```
justsearch-admin creates restaurant + owner account
    → Backend creates staff row (username: owner_mosaic, password: owner123)
    → Staff opens [restaurant]-admin.mydomain.com/login
    → Enters credentials → POST /api/v1/auth/login (type: 'staff')
    → JWT cookie set → dashboard loads
```
**Data flow:** Restaurant creation by admin enables dashboard access for staff.

### Link 2: restaurant-dashboard → customer-frontend
```
Dashboard staff edits menu / toggles item availability
    → PATCH /api/v1/menu-items/:id
    → Customer sees changes immediately on next page load
    → No cache invalidation needed (API-first with no cache)
```
**Data flow:** Menu management in dashboard drives customer-facing menu.

### Link 3: customer-frontend → restaurant-dashboard
```
Customer places order via customer-frontend checkout
    → POST /api/v1/orders
    → Dashboard polls GET /api/v1/orders every 10s
    → New order appears with "pending" status
    → Staff accepts / prepares / marks ready
```
**Data flow:** Customer orders flow into dashboard queue.

### Link 4: restaurant-dashboard → delivery-portal
```
Dashboard staff assigns driver to order
    → PATCH /api/v1/orders/:id (set driverId)
    → OR create delivery_assignments row
    → Delivery portal polls GET /api/v1/orders?driverId=...
    → Order appears in rider's queue
    → Rider updates status via slide actions
```
**Data flow:** Driver assignment in dashboard pushes order to delivery portal.

### Link 5: restaurant-dashboard → customer-frontend (Order Status)
```
Dashboard staff marks order "ready" or "out_for_delivery"
    → PATCH /api/v1/orders/:id/status
    → Customer's order status page polls every 5s
    → Sees status update: "Preparing" → "Ready" → "On the way"
```
**Data flow:** Status updates in dashboard visible to customer in real-time.

### Link 6: restaurant-dashboard → justsearch-admin (Settings)
```
Dashboard staff updates restaurant settings (contact, socials, hours)
    → PATCH /api/v1/restaurants/:id
    → Changes reflected in customer-frontend
    → Admin can view all restaurant settings in justsearch-admin
```
**Data flow:** Settings managed in dashboard, visible globally in admin.

---

## 11. Testing Commands

```bash
pnpm --filter restaurant-dashboard typecheck
pnpm --filter restaurant-dashboard dev  # Port 3002
```

## 11. Build Roadmap (What to Do Next)

### Phase 1: Fix Staff Login
| # | File | Action | Backend Needed |
|---|---|---|---|
| 1.1 | `app/login/page.tsx` | Connect form to `POST /api/v1/auth/login` | ❌ Fix backend first |
| 1.2 | `components/auth-guard.tsx` | Enable real JWT check | None |
| 1.3 | `lib/auth-store.ts` | Add role-based state | None |

### Phase 2: Connect Orders
| # | File | Action | Backend Needed |
|---|---|---|---|
| 2.1 | `app/orders/page.tsx` | Fetch `GET /api/v1/orders` | ✅ Exists |
| 2.2 | `components/orders/order-manager.tsx` | Replace mock with real data | ✅ Exists |
| 2.3 | `components/orders/order-detail-actions.tsx` | Call `PATCH /api/v1/orders/:id/status` | ✅ Exists |
| 2.4 | `hooks/use-order-manager.ts` | Add 10s polling | None |
| 2.5 | `hooks/use-order-sound.ts` | Add notification sound | None |

### Phase 3: Connect Menu Editor
| # | File | Action | Backend Needed |
|---|---|---|---|
| 3.1 | `components/menu/category-editor.tsx` | CRUD categories | ❌ Needs routes |
| 3.2 | `components/menu/item-editor-modal.tsx` | Save items to backend | ❌ Needs routes |
| 3.3 | `components/menu/menu-item-actions.tsx` | Toggle availability API | ❌ Needs `PATCH /menu-items/:id` |

### Phase 4: Connect Delivery Agents
| # | File | Action | Backend Needed |
|---|---|---|---|
| 4.1 | `app/delivery/page.tsx` | List agents | ❌ Needs `GET /delivery-agents` |
| 4.2 | `components/delivery/driver-edit-form.tsx` | Create agent | ❌ Needs `POST /delivery-agents` |
| 4.3 | `components/orders/delivery-boy-picker.tsx` | Assign driver to order | ❌ Needs `PATCH /orders/:id/driver` |

### Phase 5: Connect Vouchers & Analytics
| # | File | Action | Backend Needed |
|---|---|---|---|
| 5.1 | `app/vouchers/page.tsx` | CRUD promo codes | ❌ Needs routes |
| 5.2 | `app/analytics/page.tsx` | Fetch real stats | ❌ Needs aggregation routes |
| 5.3 | `app/customers/page.tsx` | List customers | ❌ Needs `GET /users` |

---

End of Restaurant Dashboard Agent Guide.
