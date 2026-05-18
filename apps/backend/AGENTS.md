# JustSearch Backend — Agent Development Guide

> **Location**: `apps/backend/`
> **Scope**: Express API, Drizzle ORM, PostgreSQL schema-per-tenant
> **Rule**: Never auto-commit or auto-push to git.

---

## 0. Infrastructure (Supabase + Drizzle)

| Layer | Technology | Config File |
|-------|-----------|-------------|
| **Database** | Supabase PostgreSQL | `apps/backend/.env` → `DATABASE_URL` |
| **ORM** | Drizzle ORM + Drizzle Kit | `apps/backend/drizzle.config.ts` |
| **Driver** | `postgres` (npm) with SSL | `apps/backend/src/db/index.ts` |
| **Auth** | Custom JWT (bcrypt + jsonwebtoken) | `apps/backend/.env` → `JWT_SECRET` |
| **Storage** | Supabase Storage (service role) | `apps/backend/.env` → `SUPABASE_SERVICE_ROLE_KEY` |

### 0.1 Supabase Connection

**Project**: `yxmfqvkdtvmdrfimxxvo`  
**Region**: auto-assigned by Supabase  
**SSL**: Required (`ssl: 'require'` in `postgres` client)

**`apps/backend/.env`:**
```
# Pooler (IPv4, recommended for local dev)
DATABASE_URL=postgresql://postgres.yxmfqvkdtvmdrfimxxvo:[password]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres

# Direct (IPv6 — may fail on some networks)
# DATABASE_URL=postgresql://postgres:[password]@db.yxmfqvkdtvmdrfimxxvo.supabase.co:5432/postgres

SUPABASE_URL=https://yxmfqvkdtvmdrfimxxvo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[key]
SUPABASE_ANON_KEY=[key]
JWT_SECRET=justsearch-local-dev-secret-key-32-chars-long
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MOCK_AUTH=false
SEED_ADMIN_PASSWORD=admin123
```

### 0.2 Local Dev Commands (Supabase)

```bash
# 1. Run migrations (creates tables in Supabase)
pnpm --filter backend db:migrate

# 2. Seed data (super admin + demo restaurant)
pnpm --filter backend db:seed

# 3. Start backend server
pnpm --filter backend dev
```

No Docker required — database is managed by Supabase.

---

## 1. Architecture Overview

```
PostgreSQL: justsearch_dev
├── Schema: public                    ← shared platform data
│   ├── restaurants        (registry: subdomain → schema_name)
│   ├── users              (global customers: one account everywhere)
│   ├── user_restaurants   (junction: which restaurants a user visited)
│   ├── addresses          (global address book, shared across restaurants)
│   ├── loyalty_points     (global points balance, summed across restaurants)
│   ├── games              (shared game catalog)
│   ├── advertisements     (shared ads catalog)
│   └── super_admins       (justsearch-admin login)
│
├── Schema: rest_mosaic               ← Mosaic Table isolated data
│   ├── orders, order_items
│   ├── menu_categories, menus, menu_items, promo_codes
│   ├── delivery_agents, delivery_assignments, staff
│   ├── game_sessions, otp_requests, daily_closeouts
│   └── (12 tenant tables total)
│
├── Schema: rest_<slug>               ← each new restaurant gets one
│   └── (same 12 tables, empty + seeded on creation)
```

### Global vs Per-Tenant Split

| Data Type | Schema | Why |
|-----------|--------|-----|
| **Users** | `public` | Same phone = same person everywhere |
| **User-Restaurant Links** | `public` | Tracks which restaurants a user visited |
| **Addresses** | `public` | One address book, appears at every restaurant checkout |
| **Loyalty Points** | `public` | Points sum across all restaurants (A:100 + B:200 = 300 total) |
| **Orders** | `rest_<slug>` | Each restaurant manages its own orders |
| **Order Items** | `rest_<slug>` | Line items belong to specific restaurant |
| **Game Sessions** | `rest_<slug>` | Game plays happen at specific restaurant |
| **Menu Data** | `rest_<slug>` | Each restaurant has different menu |
| **Staff / Riders** | `rest_<slug>` | Restaurant's own employees and delivery agents |

### 1.1 Why Schema-Per-Tenant

| Concern | Schema-Per-Tenant Benefit |
|---------|---------------------------|
| Data isolation | Strong — each schema is a separate namespace |
| Query simplicity | Unqualified names resolve to tenant schema via `search_path` |
| Backup/restore | Per-restaurant export: dump one schema only |
| Multi-tenant safety | No risk of `restaurant_id` filter bugs |

---

## 2. Public Schema Tables (Shared)

| Table | Purpose | Queried By |
|-------|---------|------------|
| `restaurants` | Registry — maps `subdomain` → `schema_name` | All apps |
| `users` | Global customer accounts (one phone = one user everywhere) | All apps |
| `user_restaurants` | Junction: which restaurants each user visited | All apps |
| `addresses` | Global address book (shared across restaurants) | customer-frontend |
| `loyalty_points` | Global points balance (summed across all restaurants) | customer-frontend |
| `games` | Platform game catalog | justsearch-admin, customer-frontend |
| `advertisements` | Platform ads catalog | justsearch-admin, customer-frontend |
| `super_admins` | Global admin login credentials | justsearch-admin |

**Rule**: `users`, `user_restaurants`, `addresses`, `loyalty_points` are global because customers are platform-wide. All other business data is per-tenant.

---

## 3. Tenant Schema Tables (Per-Restaurant)

Each `rest_<slug>` schema contains these 12 tables:

```sql
orders                 — order headers (per-restaurant)
order_items            — line items per order
menu_categories        — menu groupings
menus                  — menu containers
menu_items             — individual dishes/drinks
promo_codes            — discount codes
delivery_agents        — rider accounts
delivery_assignments   — order-rider links
staff                  — dashboard staff accounts
game_sessions          — played game records (per-restaurant)
otp_requests           — mobile verification codes
daily_closeouts        — end-of-day cash summaries
```

**Rule**: Every query in tenant-scoped routes uses **unqualified table names** after `SET search_path`.

---

## 4. Tenant Resolution Flow

```
User visits: mosaic-table.mydomain.com
    │
    ▼
tenant.middleware.ts
    │
    ▼
resolveSubdomain(req) → "mosaic-table"
    │
    ▼
lookupTenant("mosaic-table")
    → SELECT * FROM public.restaurants WHERE subdomain = 'mosaic-table'
    → Returns: { id, slug, schemaName: 'rest_mosaic', status }
    │
    ▼
req.tenant = tenant
    │
    ▼
SET search_path TO rest_mosaic, public
    │
    ▼
All unqualified queries hit rest_mosaic.* first, public.* as fallback
```

### 4.1 Subdomain Rules

| App | Subdomain Example | Resolved Slug |
|-----|-------------------|---------------|
| customer-frontend | `mosaic-table.mydomain.com` | `mosaic-table` |
| restaurant-dashboard | `mosaic-table-admin.mydomain.com` | `mosaic-table` (strip `-admin`) |
| delivery-portal | `mosaic-table-delivery.mydomain.com` | `mosaic-table` (strip `-delivery`) |
| justsearch-admin | `mydomain.com` (root) | `null` — no tenant |

### 4.2 search_path Behavior

| Context | search_path Set To | Effect |
|---------|-------------------|--------|
| Tenant resolved | `rest_<schema>, public` | Unqualified queries hit tenant schema first, fall back to `public` for global tables |
| Admin / no subdomain | `public` | Resets to shared tables only |

**How `search_path` resolves global tables:**
```sql
SET search_path TO "rest_naples", public;
SELECT * FROM orders     → hits rest_naples.orders     ✅ (per-tenant)
SELECT * FROM users      → tries rest_naples.users      ❌ not found → falls back to public.users ✅ (global)
SELECT * FROM addresses  → tries rest_naples.addresses  ❌ not found → falls back to public.addresses ✅ (global)
```

**Caution**: `postgres-js` pools connections (`max: 10`). `SET search_path` is session-scoped. Admin routes **must** reset to `public` to avoid stale tenant resolution from pooled connections.

---

## 5. Restaurant Creation Flow

```
POST /api/v1/restaurants
Body: { slug, subdomain, name }
    │
    ▼
1. Insert into public.restaurants
   schema_name = rest_<slug>
   Returns: restaurant.id
    │
    ▼
2. CREATE SCHEMA IF NOT EXISTS "rest_<slug>"
    │
    ▼
3. Clone 12 tenant tables:
   CREATE TABLE "rest_<slug>"."orders" (LIKE public.orders INCLUDING ALL);
   ... repeat for all 12 tables (skip users, user_restaurants, addresses, loyalty_points)
    │
    ▼
4. Seed default data into tenant schema:
   - Owner staff (username: owner, password: owner123)
   - 1 delivery agent (username: rider, password: rider123)
   - 1 table (T1, capacity 4)
   - 4 menu categories (Starters, Mains, Desserts, Drinks)
   - 1 menu ("Main Menu")
   - 1 sample customer
    │
    ▼
5. Generate QR code endpoints ready:
   - Public QR: /api/v1/restaurants/qr?type=delivery&subdomain=...
   - Table QR:  /api/v1/tables/:id/qr?size=400
    │
    ▼
Response: { restaurant: { id, slug, subdomain, schemaName, name, status } }
```

---

## 6. Cross-Schema Queries (Super Admin)

Since each restaurant's data lives in its own schema, super-admin endpoints **cannot** query tenant tables directly from `public`.

### 6.1 Option A — Dynamic Loop (Used Here)

### 6.1 When Cross-Schema Loop Is Needed

Since `orders`, `order_items`, `game_sessions` are per-tenant, platform-wide queries must loop schemas:

```typescript
// Revenue: loop all schemas, aggregate orders
const schemas = await db
  .select({ schemaName: restaurants.schemaName })
  .from(restaurants)
  .where(eq(restaurants.status, 'active'));

let totalRevenue = 0;
for (const { schemaName } of schemas) {
  const rows = await db.execute(
    sql`SELECT SUM(total) as revenue FROM ${sql.identifier(schemaName)}."orders"`
  );
  totalRevenue += Number(rows[0]?.revenue ?? 0);
}
```

**Characteristics**:
- Simple to implement (~10–15 lines per endpoint)
- Works for up to ~100 restaurants
- No data duplication
- Frontend unchanged — same API response shape

### 6.2 What Is Simple (No Cross-Schema Needed)

| Query | Schema | Why |
|-------|--------|-----|
| `public.users` | `public` | Global — one query gets all customers |
| `public.user_restaurants` | `public` | Global — one JOIN gets all restaurant links |
| `public.addresses` | `public` | Global — one query gets all addresses |
| `public.loyalty_points` | `public` | Global — one query gets all points |
| `public.restaurants` | `public` | Registry stays in public |
| `public.games` | `public` | Shared catalog |
| `public.advertisements` | `public` | Shared catalog |
| `public.super_admins` | `public` | Global admin login |
| Per-restaurant detail | `rest_<schema>` | Single schema, direct query |

### 6.3 Cross-Schema Endpoints (Loop Required)

| Endpoint | Tables Looped | Complexity |
|----------|--------------|------------|
| `GET /api/v1/revenue` | `orders` per schema | Medium |
| `GET /api/v1/analytics/admin/summary` | `orders` per schema | Medium |
| `GET /api/v1/orders/my-all` | `orders` per schema | Medium |

### 6.4 Global Endpoints (Single Query)

| Endpoint | Table | Complexity |
|----------|-------|------------|
| `GET /api/v1/admin/users` | `public.users` + `public.user_restaurants` JOIN | None |
| `GET /api/v1/admin/users/:restaurantId` | `public.users` + `public.user_restaurants` JOIN | None |
| `GET /api/v1/addresses` | `public.addresses` | None |

---

## 7. QR Code Generation

### 7.1 Package

```bash
pnpm add qrcode
```

- **License**: MIT (completely free)
- **No API keys**, no usage limits, no external service dependency
- Generates PNG/SVG buffers server-side

### 7.2 Endpoints

| Endpoint | Params | Returns |
|----------|--------|---------|
| `GET /api/v1/restaurants/qr` | `?type=delivery&subdomain=mosaic-table&size=400` | `image/png` |
| `GET /api/v1/tables/:id/qr` | `?size=400` | `image/png` |

### 7.3 URL Patterns

| QR Type | URL Encoded in QR | Scanned Result |
|---------|-------------------|----------------|
| Public (delivery) | `https://{subdomain}.{domain}/menu?intent=delivery` | Opens menu in delivery mode |
| Table (T1) | `https://{subdomain}.{domain}/menu?table=T1` | Opens menu for dine-in at table T1 |

### 7.4 Current Scope

- **1 public QR** per restaurant (delivery/general access)
- **1 table QR** per restaurant (T1 — seeded on creation)
- Future update: admin specifies `tableCount` (e.g., 10), auto-generates T1–T10

---

## 8. Existing Data Migration

### 8.1 One-Time Script

```bash
ts-node --transpile-only src/db/migrate-tenants.ts
```

**What it does**:
1. Reads `public.restaurants`
2. For each restaurant: `CREATE SCHEMA IF NOT EXISTS "rest_<slug>"`
3. Clones 18 tables into schema
4. Copies data: `INSERT INTO rest_mosaic.users SELECT * FROM public.users WHERE restaurant_id = '...'`
5. Leaves `public` data untouched (safety net)

### 8.2 Why Leave public Data

- Non-destructive — rollback possible
- `search_path` resolves tenant schema first, so live queries ignore stale `public` rows
- Can verify migration succeeded before deleting

---

## 9. File Structure Standards

```
src/
├── db/
│   ├── index.ts                    # Drizzle client + postgres-js pool
│   ├── schema/                     # Drizzle table definitions
│   ├── migrations/                 # Auto-generated by drizzle-kit
│   ├── seed.ts                     # One-time platform seed
│   ├── seed/                       # Per-resource seed functions
│   ├── tenant-template.ts          # CREATE SCHEMA + clone + seed
│   └── migrate-tenants.ts          # One-time: move public data → schemas
│
├── middleware/
│   ├── tenant.middleware.ts        # Resolve subdomain, SET search_path
│   ├── tenant-lookup.ts            # Query public.restaurants
│   ├── tenant-resolver.ts          # Extract subdomain from host/header
│   ├── auth.middleware.ts          # JWT validation + role checks
│   └── error.middleware.ts         # Global error handler
│
├── modules/
│   ├── restaurants/
│   │   ├── restaurant.routes.ts     # POST / GET (super-admin)
│   │   ├── restaurant-current.routes.ts  # GET /current (tenant-scoped)
│   │   └── restaurant-qr.routes.ts       # GET /qr (PNG generation)
│   ├── users/
│   │   ├── user.routes.ts           # Tenant-scoped customer list
│   │   └── user-admin.routes.ts     # Cross-schema user list (super-admin)
│   ├── orders/
│   │   ├── order.routes.ts          # Router composer
│   │   ├── order-create.routes.ts
│   │   ├── order-list.routes.ts
│   │   └── ...
│   ├── revenue/
│   │   ├── revenue.routes.ts        # Cross-schema revenue aggregation
│   │   └── revenue.utils.ts         # Schema-loop helpers
│   ├── analytics/
│   │   ├── analytics.routes.ts      # Tenant-scoped analytics
│   │   ├── analytics-admin.routes.ts # Cross-schema summary
│   │   └── analytics-admin.utils.ts  # Schema-loop helpers
│   └── ...
│
├── routes/
│   └── v1.routes.ts               # API v1 route composer
│
├── lib/
│   ├── hash.ts                     # bcrypt helpers
│   ├── scoring.ts                  # Game scoring logic
│   └── mock-auth.ts                # Dev mock user bypass
│
├── utils/
│   └── jwt.ts                      # Token sign/verify
│
└── server.ts                       # Express bootstrap
```

---

## 10. Critical Rules

### 10.1 Query Rules

| Route Type | Table Reference | Example |
|------------|-----------------|---------|
| Tenant-scoped | Unqualified name | `db.select().from(orders)` |
| Super-admin cross-schema | Explicit schema prefix | `sql"SELECT * FROM ${sql.identifier(schema)}."orders""` |
| Super-admin shared data | Unqualified (public) | `db.select().from(games)` |

### 10.2 Middleware Rules

- `tenant.middleware.ts` must run **before** all API routes
- `SET search_path` must execute **after** tenant lookup, **before** `next()`
- Admin requests (no subdomain) must reset `search_path TO public`

### 10.3 Creation Rules

- `POST /api/v1/restaurants` is **super-admin only**
- Restaurant creation is **atomic**: DB insert + schema creation + table cloning + seeding all succeed or all fail
- Seed data must include: owner staff, 1 rider, 1 table, 4 categories, 1 menu, 1 customer

### 10.4 Code Standards

| Rule | Enforcement |
|------|-------------|
| Max 80 lines per file | Split into utils/helpers if exceeded |
| No `console.log` | Use proper error boundaries |
| No `any` types | Strict TypeScript |
| All magic numbers in constants | `DEFAULT_TABLE_COUNT = 1` |
| No inline styles | Tailwind only (frontend) / none (backend) |

---

## 11. Testing Checklist

Before marking schema-per-tenant complete:

- [ ] `migrate-tenants.ts` ran successfully — `rest_mosaic` has cloned tables + data
- [ ] `tsc --noEmit` passes across all 5 apps
- [ ] `POST /api/v1/restaurants` creates `rest_<slug>` schema with 12 tables (not users/addresses/loyalty)
- [ ] New restaurant has default seed data (owner, rider, categories, menu)
- [ ] Tenant middleware sets `search_path` — `GET /menus` resolves to tenant schema
- [ ] Global tables (`users`, `addresses`, `loyalty_points`) resolve via `public` fallback
- [ ] Admin middleware resets `search_path` — super-admin routes don't leak tenant data
- [ ] `GET /api/v1/admin/users` returns users from `public.users` JOIN `public.user_restaurants`
- [ ] `GET /api/v1/revenue` loops schemas, aggregates `orders`
- [ ] `GET /api/v1/analytics/admin/summary` counts `public.users` + loops `orders`
- [ ] `GET /api/v1/orders/my-all` returns cross-restaurant order history
- [ ] `GET /api/v1/restaurants/qr?type=delivery` returns valid PNG
- [ ] No `console.log` statements in seed or template code
- [ ] No git mutations executed automatically

---

*This document is the living standard for JustSearch backend development. All code must conform to these rules.*
