# Customer Frontend Agent Guide

> **App**: `apps/customer-frontend`
> **Domain**: `[restaurant].mydomain.com`
> **Type**: Next.js App Router (RSC + Client Components)
> **Scope**: Public restaurant site for diners, gamers, and loyalty members

This agent handles all customer-facing functionality: restaurant landing, menu browsing, game playing, checkout, order tracking, and profile management.

---

## 1. Architecture Overview

```
Request Flow:
subdomain (mosaic-table.mydomain.com)
    → middleware.ts (extracts subdomain, sets x-restaurant-slug header)
    → layout.tsx (async RootLayout)
        → getCurrentRestaurant() (RSC, caches per request)
            → Tries: GET /api/v1/restaurants/current (backend)
            → Falls back: mock-restaurants.ts
    → page.tsx (Server Component or Client Component)
        → RestaurantProvider (React Context)
        → AppShell (mobile bottom nav)
        → Feature components
```

**Key principle**: Every page is subdomain-aware. The same `/` route renders a completely different restaurant based on the `Host` header.

---

## 2. Golden Rules

1. **Never bypass tenant resolution.** Always use `getCurrentRestaurant()` or `req.tenant`. Never hardcode restaurant data.
2. **Every API call needs the `host` header.** Backend resolves tenant from `Host` header. Without it, backend returns 400.
3. **Auth is JWT cookie-based.** After OTP verify, the backend sets `token` cookie. Frontend sends it via `credentials: 'include'`.
4. **Cart is client-side only.** Use Zustand `cart-store.ts`. Do not sync cart to backend until checkout.
5. **Game scores must persist to backend.** On game over, call `POST /api/v1/game-sessions`. Never rely only on localStorage.
6. **Order status must poll.** After placing order, poll `GET /api/v1/orders/:id` every 5 seconds for real-time updates.
7. **Mobile-first design.** All layouts must work at 375px width. Touch targets minimum 44px.

---

## 3. File Structure Standards

```
app/
├── page.tsx                    # Home: hero + feature grid (Server Component)
├── layout.tsx                  # Root layout: fonts, providers, tenant context
├── loading.tsx                 # Global loading UI
├── error.tsx                   # Global error boundary
├── menu/
│   └── page.tsx                # Menu showcase (Server Component, fetches menu)
├── eat-play/
│   ├── page.tsx                # Games listing
│   └── [gameId]/
│       └── play/
│           └── page.tsx        # Game player (Client Component, canvas)
├── profile/
│   └── page.tsx                # User profile + order history + loyalty
├── google-reviews/
│   └── page.tsx                # Reviews display
├── social-media/
│   └── page.tsx                # Social links
├── party-booking/
│   └── page.tsx                # Party packages
└── api/
    └── auth/
        └── otp/
            ├── request/
            │   └── route.ts    # Proxy to backend /api/v1/auth/otp/request
            └── verify/
                └── route.ts    # Proxy to backend /api/v1/auth/otp/verify

components/
├── layout/
│   ├── app-shell.tsx           # Mobile bottom nav + top bar
│   ├── restaurant-layout-manager.tsx
│   └── restaurant-context.tsx  # React Context for restaurant data
├── restaurant/
│   ├── restaurant-home-hero.tsx
│   ├── restaurant-feature-grid.tsx
│   ├── restaurant-menu-showcase.tsx
│   ├── restaurant-eat-play-showcase.tsx
│   ├── games/
│   │   ├── local-game-player.tsx       # Canvas game wrapper
│   │   ├── game-intro-stage.tsx
│   │   ├── game-player-stage.tsx
│   │   ├── game-award.ts               # Award calculation
│   │   ├── profile/
│   │   │   └── eat-play-profile-screen.tsx
│   │   └── local/
│   │       ├── local-game-registry.tsx
│   │       ├── vex-runner/
│   │       ├── hungry-bird-rush/
│   │       ├── cheese-chase/
│   │       └── memory-match/
│   ├── checkout/
│   │   ├── checkout-summary-card.tsx   # Cart + place order button
│   │   ├── checkout-address-card.tsx
│   │   ├── checkout-add-address-form.tsx
│   │   ├── checkout-map-address-picker.tsx
│   │   └── ...
│   └── profile/
│       └── sections/
│           └── profile-add-address-form.tsx
├── shared/
│   ├── container.tsx
│   └── surface.tsx
└── auth/
    └── registration-modal.tsx   # OTP flow UI

lib/
├── restaurant-resolver.ts      # Subdomain → restaurant resolution
├── restaurant-utils.ts
├── restaurant-types.ts
├── mock-restaurants.ts         # Fallback data (Mosaic Table demo)
├── api-client.ts               # Fetch wrapper with host header + cookies
└── server/
    └── otp-store.ts           # ⚠️ IN-MEMORY ONLY: Will be removed once OTP routes proxy to backend

stores/
└── cart-store.ts               # Zustand: cart items, totals, mode (delivery/dine-in/pickup)

public/
└── games/
    ├── jump&bite.png
    ├── hungry-bird-rush-model.png
    ├── cheddar-chase.png
    └── gem-match.png
```

---

## 4. Component Rules (Max 80 Lines)

Follow the project-wide 80-line rule strictly:

| Type | Max Lines | Example |
|------|-----------|---------|
| Page | 30 | `app/menu/page.tsx` → imports + data fetch + returns container |
| Container | 60 | `RestaurantMenuShowcase` → state + logic + delegates to presenters |
| Presenter | 50 | `RestaurantMenuHero` → props-only rendering |
| Card | 40 | `MenuItemCard` → single item display |
| List | 50 | `MenuSectionsList` → maps over array |
| Form | 60 | `CheckoutAddAddressForm` → inputs + validation |
| Empty | 25 | `MenuEmpty` → illustration + text |
| Skeleton | 25 | `MenuSkeleton` → loading placeholder |

If a component exceeds 80 lines, split it into smaller pieces immediately.

---

## 5. API Integration Rules

### 5.1 Required Headers
Every API call MUST include:
```typescript
fetch(`${API_BASE}/endpoint`, {
  headers: {
    'Content-Type': 'application/json',
    'host': window.location.host,  // ← CRITICAL for tenant resolution
  },
  credentials: 'include',  // ← Sends JWT cookie
});
```

### 5.2 API Base URL
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
```

### 5.3 Backend Endpoints (What Exists)
| Endpoint | Status | Usage |
|---|---|---|
| `GET /api/v1/restaurants/current` | ✅ Ready | Home page, layout |
| `GET /api/v1/menus` | ✅ Ready | Menu page |
| `POST /api/v1/auth/otp/request` | ✅ Ready | OTP request |
| `POST /api/v1/auth/otp/verify` | ✅ Ready | OTP verify |
| `GET /api/v1/auth/me` | ✅ Ready | Profile page |
| `POST /api/v1/orders` | ✅ Ready | Checkout |
| `GET /api/v1/orders/:id` | ✅ Ready | Order status |
| `POST /api/v1/game-sessions` | ❌ Not ready | Save game score |
| `GET /api/v1/game-sessions` | ❌ Not ready | Leaderboard |
| `GET /api/v1/loyalty-points` | ❌ Not ready | Points balance |

### 5.4 Frontend API Routes (Proxies)
These Next.js API routes proxy to the backend:
```
app/api/auth/otp/request/route.ts   → POST /api/v1/auth/otp/request
app/api/auth/otp/verify/route.ts    → POST /api/v1/auth/otp/verify
```

**Why proxies?** The frontend needs to:
1. Pass `host` header for tenant resolution
2. Set the `token` cookie securely (httpOnly, SameSite)
3. Handle CORS between different ports/hosts

---

## 6. Authentication Flow

```
1. User opens registration modal
2. Enters name + mobile
3. Frontend calls POST /api/auth/otp/request
   → Proxies to backend POST /api/v1/auth/otp/request
   → Backend creates otp_requests row (5-min TTL)
   → Returns { requestId, demoOtp: "1234" } (demoOtp only in dev)
4. User enters OTP
5. Frontend calls POST /api/auth/otp/verify
   → Proxies to backend POST /api/v1/auth/otp/verify
   → Backend verifies OTP, creates/finds user
   → Returns { verified: true, token, user }
   → Frontend sets cookie: token={jwt}
6. User is now authenticated
   → All subsequent API calls include cookie via credentials: 'include'
7. On page reload:
   → Frontend calls GET /api/v1/auth/me (uses cookie)
   → Returns current user profile
```

---

## 7. Cart & Checkout Flow

```
1. User browses menu, adds items to cart
   → Zustand cart-store updates
   → AppShell shows cart badge
2. User taps cart → checkout page opens
3. User selects address (delivery) or table (dine-in)
4. User enters promo code (optional)
5. User taps "Place Order"
   → Frontend calls POST /api/v1/orders
   → Backend creates order + order_items rows
   → Returns { order: { id, code, status, total } }
   → Frontend redirects to /orders/{orderId}
6. Order status page polls every 5s
   → Shows real-time status updates
   → ETA countdown
```

---

## 8. Game Integration Rules

### 8.1 Game Architecture
Every game follows the 4-file pattern:
```
components/restaurant/games/local/{game-id}/
  ├── {game-id}-model.ts        # Types, constants, score mapping
  ├── {game-id}-canvas-art.ts   # Canvas drawing functions
  ├── use-{game-id}-engine.ts   # Physics, collisions, game loop
  └── {game-id}-game.tsx        # React component (canvas + HUD)
```

### 8.2 Adding a New Game
1. Create the 4 files above
2. Add game metadata to `mock-restaurants.ts` (games array)
3. Register in `local-game-registry.tsx`
4. Run `pnpm --filter customer-frontend typecheck`

### 8.3 Score Persistence
On game over, the engine calls:
```typescript
onAward({ points, score, label }) => {
  // 1. Save to backend
  apiClient('/game-sessions', {
    method: 'POST',
    body: {
      gameId: game.localGameId,
      score,
      pointsAwarded: points,
      scoringVersion: '1.0',
    },
  });

  // 2. Update local state
  setAward({ points, score, label });
};
```

---

## 9. Build Checklist

Before marking any customer-frontend feature complete:

- [ ] No component exceeds 80 lines
- [ ] All API calls use `credentials: 'include'`
- [ ] All API calls pass `host` header
- [ ] `tsc --noEmit` passes (`pnpm --filter customer-frontend typecheck`)
- [ ] Mobile responsive (test at 375px)
- [ ] Touch targets minimum 44px
- [ ] Loading states handled (skeleton or spinner)
- [ ] Empty states handled (illustration + text)
- [ ] Error states handled (toast or inline error)
- [ ] No `console.log` in production code
- [ ] `next/image` used for all images (with proper sizes)
- [ ] Animations use extracted variants (not inline config)
- [ ] Zustand stores use `persist` middleware where needed

---

## 10. Testing Commands

```bash
# TypeScript check
pnpm --filter customer-frontend typecheck

# Dev server (port 3000)
pnpm --filter customer-frontend dev

# Build for production
pnpm --filter customer-frontend build

# Lint
pnpm --filter customer-frontend lint
```

---

## 11. Common Pitfalls

1. **Forgetting `host` header** → Backend returns "Tenant context required"
2. **Missing `credentials: 'include'`** → JWT cookie not sent, 401 Unauthorized
3. **Not handling API fallback** → When backend is down, page crashes instead of showing mock data
4. **Server Component calling client API** → `window` is undefined in RSC. Use `"use client"` or pass data as props.
5. **Zustand hydration mismatch** → Use `useStore` pattern with `typeof window !== 'undefined'` check.
6. **Game canvas not responsive** → Canvas must resize with `ResizeObserver` or `window resize` event.
7. **OTP modal not closing after verify** → Always call `onClose()` after successful verification.

---

## 12. Cross-Platform Links (How Customer Frontend Connects to Other Portals)

### Link 1: justsearch-admin → customer-frontend
```
justsearch-admin creates restaurant (POST /api/v1/restaurants)
    → Backend creates public.restaurants row
    → Customer visits [restaurant].mydomain.com
    → customer-frontend fetches GET /api/v1/restaurants/current
    → Renders restaurant landing page
```
**Data flow:** Restaurant name, theme, logo, menu, games — all set by admin, displayed by customer-frontend.

### Link 2: restaurant-dashboard → customer-frontend
```
restaurant-dashboard staff edits menu (PATCH /api/v1/menu-items/:id)
    → Backend updates menu_items table
    → Customer refreshes menu page
    → customer-frontend fetches GET /api/v1/menus
    → Sees updated prices / availability immediately
```
**Data flow:** Menu changes made in dashboard are instantly visible to customers.

### Link 3: customer-frontend → restaurant-dashboard
```
Customer places order (POST /api/v1/orders from checkout)
    → Backend creates orders + order_items rows
    → restaurant-dashboard polls GET /api/v1/orders every 10s
    → New order appears in dashboard with "pending" status
    → Sound notification plays
```
**Data flow:** Customer order immediately appears in staff dashboard.

### Link 4: customer-frontend → delivery-portal
```
Customer places delivery order
    → restaurant-dashboard assigns driver (PATCH /orders/:id/driver)
    → delivery-portal polls GET /api/v1/orders?driverId=...
    → Order appears in rider queue
    → Rider updates status (picked_up → in_transit → delivered)
    → customer-frontend polls GET /api/v1/orders/:id
    → Customer sees "On the way" → "Delivered"
```
**Data flow:** Order status changes in delivery portal are visible to customer in real-time.

### Link 5: justsearch-admin → customer-frontend (Games)
```
justsearch-admin creates game (POST /api/v1/games)
    → Backend creates games row in public schema
    → admin links game to restaurant via restaurant_games junction
    → customer-frontend fetches games list
    → Game appears in /eat-play page
```
**Data flow:** Platform-level games activated per restaurant by admin.

---

## 13. Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_BASE_DOMAIN=mydomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Only variables prefixed with `NEXT_PUBLIC_` are available in client-side code.

## 13. Build Roadmap (What to Do Next)

### Phase 1: Connect OTP to Backend (Critical)
| # | File | Action | Backend Needed |
|---|---|---|---|
| 1.1 | `lib/api-client.ts` | Add `credentials: 'include'` | None |
| 1.2 | `app/api/auth/otp/request/route.ts` | Replace with proxy to `POST /api/v1/auth/otp/request` | ✅ Exists |
| 1.3 | `app/api/auth/otp/verify/route.ts` | Replace with proxy to `POST /api/v1/auth/otp/verify` | ✅ Exists |
| 1.4 | `lib/server/otp-store.ts` | **Delete** after proxy works | N/A |

### Phase 2: Connect Checkout
| # | File | Action | Backend Needed |
|---|---|---|---|
| 2.1 | `components/checkout/checkout-summary-card.tsx` | Add `onPlaceOrder` → `POST /api/v1/orders` | ✅ Exists |
| 2.2 | `app/orders/[orderId]/page.tsx` | **Create** — fetch `GET /api/v1/orders/:id` | ✅ Exists |
| 2.3 | `components/orders/order-status-timeline.tsx` | **Create** — visual stepper | None |

### Phase 3: Connect Game Sessions
| # | File | Action | Backend Needed |
|---|---|---|---|
| 3.1 | `app/api/game-sessions/route.ts` | **Create** — proxy `POST /api/v1/game-sessions` | ❌ Needs route |
| 3.2 | `components/games/local-game-player.tsx` | Add save score call | ✅ Proxy ready |
| 3.3 | `components/games/profile/eat-play-profile-screen.tsx` | Fetch `GET /api/v1/game-sessions` | ❌ Needs route |

### Phase 4: Connect Profile & Loyalty
| # | File | Action | Backend Needed |
|---|---|---|---|
| 4.1 | `app/profile/page.tsx` | Fetch `GET /api/v1/auth/me` | ✅ Exists |
| 4.2 | `components/profile/profile-loyalty-card.tsx` | **Create** — fetch points | ❌ Needs route |
| 4.3 | `components/profile/profile-order-history.tsx` | **Create** — fetch orders | ❌ Needs route |

### Phase 5: Connect Address Management
| # | File | Action | Backend Needed |
|---|---|---|---|
| 5.1 | `components/checkout/checkout-add-address-form.tsx` | Save to backend | ❌ Needs table + route |
| 5.2 | `app/api/addresses/route.ts` | **Create** — proxy to backend | ❌ Needs backend route |

---

End of Customer Frontend Agent Guide.
