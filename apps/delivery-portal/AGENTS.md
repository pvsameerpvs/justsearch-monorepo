# Delivery Portal Agent Guide

> **App**: `apps/delivery-portal`
> **Domain**: `[restaurant]-delivery.mydomain.com`
> **Type**: Next.js App Router
> **Scope**: Delivery agent execution portal

This agent handles the delivery rider interface: login, assigned orders, route tracking, status updates, and earnings.

---

## 1. Architecture Overview

```
Request Flow:
subdomain (mosaic-table-delivery.mydomain.com)
    → middleware.ts (extracts subdomain, strips "-delivery" suffix)
    → layout.tsx
        → DriverAuthProvider (checks localStorage auth)
            → AuthGuard (redirects to /login if not authenticated)
    → page.tsx
        → Fetches delivery portal snapshot
            → Tries: backend API
            → Falls back: mock-delivery-data.ts
```

**Key principle**: This is a focused execution workspace. Minimal UI, maximum speed.

---

## 2. Golden Rules

1. **One page, all information.** The delivery agent should never need to navigate. Everything is on the home page.
2. **Slide-to-confirm actions.** Accept delivery, mark picked up, mark delivered — all use slide gestures (like Uber).
3. **Offline-first.** Cache active orders. If connection drops, agent can still see their route.
4. **GPS tracking.** Capture location every 30 seconds when on active delivery.
5. **Cash on delivery tracking.** If payment mode is COD, show exact amount to collect.
6. **No deep navigation.** Sidebar, multiple pages, settings — all removed. This is a single-purpose tool.

---

## 3. File Structure Standards

```
app/
├── page.tsx                    # Main portal page (assigned + completed orders)
├── layout.tsx                  # Auth guard + driver provider
├── globals.css
├── not-found.tsx
└── orders/
    └── [orderId]/
        └── page.tsx            # Single order detail (if needed)

components/
├── layout/
│   ├── delivery-portal-shell.tsx   # Restaurant header + agent card
│   ├── portal-nav.tsx              # Minimal top nav
│   └── auth-guard.tsx              # Redirects unauthenticated to login
├── login/
│   ├── login-container.tsx         # Login page layout
│   ├── login-form-presenter.tsx    # Username + password form
│   ├── parts/
│   │   ├── login-username-input.tsx
│   │   ├── password-input.tsx
│   │   ├── login-submit-button.tsx
│   │   ├── login-error-message.tsx
│   │   ├── login-logo.tsx
│   │   └── demo-credentials.tsx
│   └── hooks/
│       └── use-login-form.ts       # Form validation + submit
├── orders/
│   ├── driver-home-view.tsx        # Main view: active + completed
│   ├── driver-current-order-card.tsx
│   ├── driver-queue-section.tsx    # List of assigned orders
│   ├── driver-queue-item.tsx       # Single queue item
│   ├── driver-completed-section.tsx
│   ├── driver-status-stepper.tsx   # Visual delivery progress
│   ├── driver-animated-stepper.tsx
│   ├── driver-slide-button.tsx     # Slide to confirm action
│   ├── driver-slide-done.tsx       # Success state after slide
│   ├── driver-slide-cod-badge.tsx  # Cash on delivery indicator
│   ├── driver-payment-sheet.tsx    # Payment details bottom sheet
│   ├── driver-payment-items.tsx
│   ├── driver-expandable-items.tsx
│   ├── driver-order-card-customer.tsx
│   ├── driver-order-card-map-section.tsx
│   ├── driver-order-meta-card.tsx
│   ├── driver-order-notes.tsx
│   ├── driver-refresh-button.tsx
│   └── hooks/
│       └── use-slide-action.ts     # Slide gesture logic

lib/
├── driver-auth-store.tsx       # Zustand: isLoggedIn, driverId, restaurantSlug
├── portal-context.ts           # Resolves restaurant from subdomain
├── mock-delivery-data.ts       # Fallback data (Mosaic Table delivery)
└── delivery-types.ts           # TypeScript types
```

---

## 4. Component Rules (Max 80 Lines)

| Type | Max Lines | Notes |
|------|-----------|-------|
| Page | 40 | Home page is the entire app |
| Card | 40 | Order card with all details |
| Slide Button | 60 | Complex gesture handling |
| Status Stepper | 50 | Visual progress indicator |
| List Item | 30 | Queue item |
| Modal/Sheet | 40 | Payment details |

---

## 5. Auth Flow

### 5.1 Login
```
1. Rider opens [restaurant]-delivery.mydomain.com
2. AuthGuard checks localStorage "driver-auth"
   → If exists + valid: show dashboard
   → If missing/invalid: redirect to login page
3. Login page shows username + password
4. On submit: calls POST /api/v1/auth/login
   → Body: { username, password, type: 'delivery' }
   → Backend checks delivery_agents table
   → Returns JWT with { userId, role: 'driver', restaurantId }
   → Frontend stores in localStorage + sets cookie
```

### 5.2 Session Persistence
- Store in localStorage: `{ isLoggedIn, driverId, restaurantSlug, driverName }`
- Rehydrate on page load (handled by DriverAuthProvider)
- JWT cookie used for API authentication

---

## 6. Order Lifecycle (Rider Perspective)

```
1. Order assigned to rider
   → Shows in "Active drop-offs" section
   → Slide to "Accept"

2. Rider at restaurant
   → Slide to "Picked Up"
   → Status: assigned → picked_up
   → Backend updates delivery_assignments.status

3. Rider en route
   → GPS tracking active (poll every 30s)
   → Status: picked_up → in_transit
   → Customer sees "On the way"

4. Rider arrives
   → Slide to "Delivered"
   → If COD: show payment confirmation
   → Status: in_transit → delivered
   → Order moves to "Completed this shift"
```

---

## 7. API Integration

### 7.1 Endpoints Needed
| Endpoint | Status | Usage |
|---|---|---|
| `POST /api/v1/auth/login` | ❌ Not ready | Rider login (backend returns 501 — needs delivery_agents table lookup) |
| `GET /api/v1/orders?driverId=...` | ❌ Not ready | Rider's assigned orders |
| `PATCH /api/v1/delivery-assignments/:id/status` | ❌ Not ready | Update delivery status |
| `PATCH /api/v1/orders/:id/location` | ❌ Not ready | GPS update |
| `GET /api/v1/delivery-agents/me` | ❌ Not ready | Rider profile |

### 7.2 Polling Strategy
- Active orders: poll every 10 seconds
- GPS location: send every 30 seconds when status is `in_transit`
- Completed orders: refresh on manual pull-to-refresh only

---

## 8. Build Checklist

- [ ] Single-page design (no navigation needed)
- [ ] Slide-to-confirm for all status changes
- [ ] GPS tracking when delivering
- [ ] COD payment confirmation flow
- [ ] Offline cache for active orders
- [ ] Pull-to-refresh for completed orders
- [ ] Large touch targets (minimum 56px for slide buttons)
- [ ] `tsc --noEmit` passes

---

## 9. Cross-Platform Links (How Delivery Portal Connects to Other Portals)

### Link 1: restaurant-dashboard → delivery-portal
```
restaurant-dashboard creates delivery agent
    → POST /api/v1/delivery-agents
    → Backend creates delivery_agents row
    → Rider opens [restaurant]-delivery.mydomain.com
    → Logs in with credentials created by dashboard
    → Accesses assigned orders
```
**Data flow:** Driver accounts created in dashboard, used in delivery portal.

### Link 2: customer-frontend → delivery-portal
```
Customer places delivery order
    → POST /api/v1/orders (fulfillment_type: 'delivery')
    → Dashboard assigns driver
    → Order appears in delivery portal queue
    → Rider accepts → picks up → delivers
    → Each status update visible to customer
```
**Data flow:** Delivery order lifecycle spans all 3 operational portals.

### Link 3: delivery-portal → customer-frontend
```
Rider marks order "delivered"
    → PATCH /api/v1/delivery-assignments/:id/status
    → Backend updates orders.status to 'completed'
    → Customer's status page shows "Delivered"
    → Customer can rate / review
```
**Data flow:** Final delivery status visible to customer immediately.

### Link 4: delivery-portal → restaurant-dashboard
```
Rider marks order "picked_up"
    → Backend updates delivery_assignments.status
    → Dashboard sees order status change
    → Kitchen knows order is out for delivery
    → Dashboard shows "out_for_delivery" in order list
```
**Data flow:** Rider actions update dashboard view for staff awareness.

### Link 5: delivery-portal → justsearch-admin (Analytics)
```
Rider completes delivery
    → delivery_assignments.status = 'delivered'
    → Backend logs completion time
    → justsearch-admin analytics aggregates delivery times
    → Shows metrics: avg delivery time, on-time rate, rider performance
```
**Data flow:** Delivery data feeds platform-level analytics in admin.

---

## 10. Testing Commands

```bash
pnpm --filter delivery-portal typecheck
pnpm --filter delivery-portal dev  # Port 3004
```

## 10. Build Roadmap (What to Do Next)

### Phase 1: Fix Rider Login
| # | File | Action | Backend Needed |
|---|---|---|---|
| 1.1 | `components/login/login-container.tsx` | Connect to `POST /api/v1/auth/login` | ❌ Fix backend first |
| 1.2 | `components/login/parts/demo-credentials.tsx` | Remove hardcoded credentials | None |
| 1.3 | `lib/driver-auth-store.tsx` | Replace localStorage with JWT cookie | None |

### Phase 2: Connect Order Queue
| # | File | Action | Backend Needed |
|---|---|---|---|
| 2.1 | `app/page.tsx` | Fetch `GET /api/v1/orders?driverId=...` | ❌ Needs route |
| 2.2 | `components/orders/driver-home-view.tsx` | Replace mock with real data | ❌ Needs route |
| 2.3 | `components/orders/driver-queue-section.tsx` | Show assigned orders | ❌ Needs route |

### Phase 3: Connect Slide Actions
| # | File | Action | Backend Needed |
|---|---|---|---|
| 3.1 | `components/orders/driver-slide-button.tsx` | Call `PATCH /delivery-assignments/:id/status` | ❌ Needs route |
| 3.2 | `hooks/use-slide-action.ts` | Add error handling | None |
| 3.3 | `components/orders/driver-status-stepper.tsx` | Reflect real status | None |

### Phase 4: Connect GPS & COD
| # | File | Action | Backend Needed |
|---|---|---|---|
| 4.1 | `app/page.tsx` | Send GPS every 30s | ❌ Needs `PATCH /orders/:id/location` |
| 4.2 | `components/orders/driver-payment-sheet.tsx` | Show COD amount | None |
| 4.3 | `components/orders/driver-slide-cod-badge.tsx` | Confirm cash collection | None |

---

End of Delivery Portal Agent Guide.
