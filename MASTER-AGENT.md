# JustSearch Master Agent Guide

> **Rule**: Never auto-commit or push to git. Manual only.
> **Architecture**: Shared-schema multi-tenancy with `restaurantId` foreign keys.
> **Max**: 80 lines per component file. Split when exceeded.

---

## 1. Multi-Tenant Domain Architecture

```
Internet DNS
    |
    ├─ *.mydomain.com ──→ Vercel/Server
    │       |
    │       ├─ mydomain.com ─────────────→ justsearch-admin (port 3003)
    │       |
    │       ├─ [restaurant].mydomain.com ──→ customer-frontend (port 3000)
    │       |       |
    │       |       └─→ Backend resolves subdomain → tenant data
    │       |
    │       ├─ [restaurant]-admin.mydomain.com ──→ restaurant-dashboard (port 3002)
    │       |       |
    │       |       └─→ Strip "-admin" → get restaurant slug
    │       |
    │       └─ [restaurant]-delivery.mydomain.com ──→ delivery-portal (port 3004)
    │               |
    │               └─→ Strip "-delivery" → get restaurant slug
    |
    └─→ Backend API (port 3001) ──→ All apps call this
            |
            └─→ Tenant middleware resolves Host header → restaurant_id
```

---

## 2. DNS Configuration

### Production
```
*.mydomain.com          CNAME   cname.vercel-dns.com
mydomain.com            A       YOUR_SERVER_IP
```

### Local Development (/etc/hosts)
```
127.0.0.1  localhost
127.0.0.1  mosaic-table.localhost
127.0.0.1  mosaic-table-admin.localhost
127.0.0.1  mosaic-table-delivery.localhost
127.0.0.1  mydomain.localhost
```

---

## 3. Subdomain Resolution (Per App)

### customer-frontend
```
Host: "mosaic-table.mydomain.com"
  → Strip ".mydomain.com"
  → slug = "mosaic-table"
  → Backend: SELECT * FROM restaurants WHERE subdomain = 'mosaic-table'
```

### restaurant-dashboard
```
Host: "mosaic-table-admin.mydomain.com"
  → Strip "-admin.mydomain.com"
  → slug = "mosaic-table"
```

### delivery-portal
```
Host: "mosaic-table-delivery.mydomain.com"
  → Strip "-delivery.mydomain.com"
  → slug = "mosaic-table"
```

### justsearch-admin
```
Host: "mydomain.com"
  → No subdomain extraction
  → No tenant filtering
```

---

## 4. Backend Tenant Middleware

The `tenant.middleware.ts` must:
1. Read `Host` header (or `x-forwarded-host`)
2. Strip port suffix `:3000`
3. Extract subdomain from `.mydomain.com` or `.localhost`
4. Strip `-admin` and `-delivery` suffixes
5. Look up `public.restaurants` table by `subdomain`
6. Attach `req.tenant = { id, slug, subdomain, schemaName, status }`
7. Reject if restaurant not found or suspended

**Golden Rule**: Every database query MUST filter by `req.tenant.id`.

---

## 5. Authentication Architecture

| Portal | Method | Storage |
|---|---|---|
| customer-frontend | Name + Mobile + OTP | Per-tenant `users` table |
| restaurant-dashboard | Username + Password | Per-tenant `staff` table |
| delivery-portal | Username + Password | Per-tenant `delivery_agents` table |
| justsearch-admin | Username + Password | `public.super_admins` table |

**JWT**: 24h expiry, signed with `JWT_SECRET`, stored in `httpOnly` cookie.
**Password Hashing**: `bcrypt` cost factor 12.
**Customer OTP**: 4-digit, 5-min TTL, max 5 attempts, stored in `otp_requests` table.

---

## 6. API Client Rules

Every frontend API call MUST:
1. Include `credentials: 'include'` to send JWT cookie
2. Include `host` header so backend can resolve tenant
3. Handle 401 by redirecting to login
4. Handle 404 by showing restaurant not found

```typescript
fetch(`${API_BASE}/endpoint`, {
  headers: { 'Content-Type': 'application/json', 'host': window.location.host },
  credentials: 'include',
});
```

---

## 7. Component Architecture (80-Line Rule)

If a file exceeds 80 lines, split it immediately.

| Type | Max Lines | Responsibility |
|---|---|---|
| Page | 30 | Route entry, data fetch, metadata |
| Container | 60 | Data fetching, state, business logic |
| Presenter | 50 | Props-only rendering |
| Card | 40 | Single item display |
| List | 50 | Array rendering + empty/loading |
| Form | 60 | Input collection + validation |
| Empty | 25 | Empty state illustration |
| Skeleton | 25 | Loading placeholder |

---

## 8. Build Order (What To Implement Now)

### Phase 1: Fix Backend Auth (Unblocks All Portals)
| # | File | Action |
|---|---|---|
| 1.1 | `backend/src/modules/auth/auth.routes.ts` | Implement `/login` for staff/delivery/super_admin |
| 1.2 | `backend/src/modules/auth/auth.routes.ts` | Add `GET /auth/me` for all user types |
| 1.3 | `backend/src/db/seed.ts` | Add super_admin seed record |

### Phase 2: Fix Tenant Middleware
| # | File | Action |
|---|---|---|
| 2.1 | `backend/src/middleware/tenant.middleware.ts` | Handle `-admin` and `-delivery` suffix stripping |
| 2.2 | `backend/src/middleware/tenant.middleware.ts` | Handle `.localhost` correctly |

### Phase 3: Connect Customer Frontend
| # | File | Action |
|---|---|---|
| 3.1 | `customer-frontend/lib/api-client.ts` | Add `credentials: 'include'` |
| 3.2 | `customer-frontend/app/api/auth/otp/request/route.ts` | Proxy to backend |
| 3.3 | `customer-frontend/app/api/auth/otp/verify/route.ts` | Proxy to backend |
| 3.4 | `customer-frontend/components/checkout/checkout-summary-card.tsx` | Call `POST /api/v1/orders` |

### Phase 4: Connect Restaurant Dashboard
| # | File | Action |
|---|---|---|
| 4.1 | `restaurant-dashboard/app/login/page.tsx` | Connect to `POST /api/v1/auth/login` |
| 4.2 | `restaurant-dashboard/lib/api-client.ts` | Create API client |
| 4.3 | `restaurant-dashboard/components/orders/order-manager.tsx` | Fetch `GET /api/v1/orders` |

### Phase 5: Connect Delivery Portal
| # | File | Action |
|---|---|---|
| 5.1 | `delivery-portal/lib/api-client.ts` | Create API client |
| 5.2 | `delivery-portal/components/login/login-container.tsx` | Connect to login API |
| 5.3 | `delivery-portal/lib/driver-auth-store.tsx` | Use JWT cookie |

### Phase 6: Connect JustSearch Admin
| # | File | Action |
|---|---|---|
| 6.1 | `justsearch-admin/app/login/page.tsx` | Create super admin login |
| 6.2 | `justsearch-admin/lib/api-client.ts` | Create API client |
| 6.3 | `justsearch-admin/app/restaurants/page.tsx` | Fetch `GET /api/v1/restaurants` |

---

## 9. Environment Variables

```
# Backend
PORT=3001
JWT_SECRET=minimum-32-characters-long-secret
DATABASE_URL=postgresql://.../postgres
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Frontend (all apps)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_BASE_DOMAIN=mydomain.com
```

---

## 10. Testing Locally

### Edit /etc/hosts
```
127.0.0.1  localhost
127.0.0.1  mosaic-table.localhost
127.0.0.1  mosaic-table-admin.localhost
127.0.0.1  mosaic-table-delivery.localhost
127.0.0.1  mydomain.localhost
```

### Start All Apps
```bash
# Terminal 1: Backend
pnpm --filter backend dev

# Terminal 2: Customer Frontend
pnpm --filter customer-frontend dev

# Terminal 3: Restaurant Dashboard
pnpm --filter restaurant-dashboard dev

# Terminal 4: Delivery Portal
pnpm --filter delivery-portal dev

# Terminal 5: JustSearch Admin
pnpm --filter justsearch-admin dev
```

---

## 11. File Structure (What Must Exist)

### Backend
```
backend/src/
  ├── app.ts                      # Express with tenant middleware
  ├── middleware/
  │   ├── tenant.middleware.ts    # Host → restaurant resolution
  │   ├── auth.middleware.ts      # JWT validation
  │   └── error.middleware.ts     # Error handler
  ├── modules/
  │   ├── auth/
  │   │   └── auth.routes.ts     # OTP + login + me
  │   ├── orders/
  │   │   └── order.routes.ts    # Order CRUD
  │   └── restaurants/
  │       └── restaurant.routes.ts # Admin CRUD
  ├── db/
  │   ├── schema/                 # 25 schema files
  │   ├── seed.ts                 # Demo data
  │   └── index.ts                # Drizzle client
  └── routes/v1.routes.ts         # API router
```

### customer-frontend
```
app/
  ├── page.tsx                    # Home (Server Component)
  ├── layout.tsx                  # Root layout
  ├── menu/page.tsx               # Menu
  ├── eat-play/page.tsx           # Games
  ├── profile/page.tsx            # Profile
  └── api/auth/otp/
      ├── request/route.ts        # Proxy to backend
      └── verify/route.ts         # Proxy to backend
components/
  ├── layout/app-shell.tsx        # Bottom nav + top bar
  ├── checkout/
  │   └── checkout-summary-card.tsx
  └── restaurant/
      └── restaurant-home-hero.tsx
lib/
  ├── api-client.ts               # Fetch wrapper
  └── restaurant-resolver.ts      # Subdomain resolution
stores/
  └── cart-store.ts               # Zustand cart
```

### restaurant-dashboard
```
app/
  ├── page.tsx                    # Homepage / dashboard
  ├── login/page.tsx              # Staff login
  └── orders/page.tsx             # Order manager
components/
  ├── layout/
  │   └── dashboard-shell.tsx
  ├── orders/
  │   └── order-manager.tsx
  └── login/
      └── login-container.tsx
lib/
  └── api-client.ts               # API client
```

### delivery-portal
```
app/
  ├── page.tsx                    # Main portal
  ├── layout.tsx                  # Auth guard
  └── login/page.tsx              # Rider login
components/
  ├── layout/
  │   ├── delivery-portal-shell.tsx
  │   └── auth-guard.tsx
  ├── login/
  │   └── login-container.tsx
  └── orders/
      └── driver-home-view.tsx
lib/
  ├── api-client.ts
  ├── portal-context.ts           # Subdomain resolver
  └── driver-auth-store.tsx       # Zustand auth
```

### justsearch-admin
```
app/
  ├── page.tsx                    # Dashboard
  ├── login/page.tsx              # Super admin login
  └── restaurants/page.tsx        # Restaurant list
components/
  ├── layout/
  │   └── admin-shell.tsx
  ├── login/
  │   └── admin-login-form.tsx
  └── restaurants/
      └── restaurant-list.tsx
lib/
  └── api-client.ts
```

---

## 12. Critical Rules

1. **Never auto-push git.** All git commands are manual.
2. **Never exceed 80 lines per file.** Split immediately.
3. **Every query filters by `restaurantId`.** No exceptions.
4. **Every API call sends `host` header and `credentials: 'include'`.**
5. **Use `next/image` for all images.**
6. **Forms use React Hook Form + Zod.**
7. **Animations use extracted Framer Motion variants.**
8. **No `console.log` in production code.**
9. **No `any` types.** Use `unknown` then narrow.
10. **Loading, empty, and error states are mandatory for all data fetching.**

---

End of Master Agent Guide.
