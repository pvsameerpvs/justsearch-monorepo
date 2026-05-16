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
│   ├── games              (shared game catalog)
│   ├── advertisements     (shared ads catalog)
│   ├── restaurant_games   (junction: who gets which game)
│   └── super_admins       (justsearch-admin login)
│
├── Schema: rest_mosaic               ← Mosaic Table isolated data
│   ├── users, restaurant_users, restaurant_tables
│   ├── menu_categories, menus, menu_items, promo_codes
│   ├── orders, order_items, payments
│   ├── delivery_agents, delivery_assignments, staff
│   ├── loyalty_points, table_sessions, game_sessions
│   ├── audit_logs, otp_requests
│   └── (18 tenant tables total)
│
├── Schema: rest_<slug>               ← each new restaurant gets one
│   └── (same 18 tables, empty + seeded on creation)
```

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
| `games` | Platform game catalog | justsearch-admin, customer-frontend |
| `advertisements` | Platform ads catalog | justsearch-admin, customer-frontend |
| `restaurant_games` | Junction — which restaurant has which game | customer-frontend |
| `super_admins` | Global admin login credentials | justsearch-admin |

**Rule**: Public tables never contain per-restaurant business data.

---

## 3. Tenant Schema Tables (Per-Restaurant)

Each `rest_<slug>` schema contains these 18 tables:

```sql
users                  — customers, staff-linked users
restaurant_users       — staff role assignments (junction)
restaurant_tables      — physical tables, qr_code_url, qr_payload
menu_categories        — menu groupings
menus                  — menu containers
menu_items             — individual dishes/drinks
promo_codes            — discount codes
orders                 — order headers
order_items            — line items per order
payments               — payment records
delivery_agents        — rider accounts
delivery_assignments   — order-rider links
staff                  — dashboard staff accounts
loyalty_points         — customer reward balances
table_sessions         — active dine-in sessions
game_sessions          — played game records
audit_logs             — change history
otp_requests           — mobile verification codes
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
| Tenant resolved | `rest_<schema>, public` | Unqualified queries hit tenant schema first |
| Admin / no subdomain | `public` | Resets to shared tables only |

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
3. Clone 18 tenant tables:
   CREATE TABLE "rest_<slug>"."users" (LIKE public.users INCLUDING ALL);
   ... repeat for all 18 tables
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

```typescript
// 1. Get all active schemas
const schemas = await db
  .select({ schemaName: restaurants.schemaName })
  .from(restaurants)
  .where(eq(restaurants.status, 'active'));

// 2. Loop + UNION ALL
const results = [];
for (const { schemaName } of schemas) {
  const rows = await db.execute(
    sql`SELECT * FROM ${sql.identifier(schemaName)}."users"`
  );
  results.push(...rows);
}
```

**Characteristics**:
- Simple to implement (~10–15 lines per endpoint)
- Works for up to ~100 restaurants
- No data duplication
- Frontend unchanged — same API response shape

### 6.2 What Stays Simple (No Cross-Schema Needed)

| Query | Schema | Why |
|-------|--------|-----|
| `public.restaurants` | `public` | Registry stays in public |
| `public.games` | `public` | Shared catalog |
| `public.advertisements` | `public` | Shared catalog |
| `public.super_admins` | `public` | Global admin login |
| Per-restaurant detail | `rest_<schema>` | Single schema, direct query |

### 6.3 Cross-Schema Endpoints

| Endpoint | Approach | Complexity |
|----------|----------|------------|
| `GET /api/v1/admin/users` | Loop schemas, UNION ALL `users` | Low |
| `GET /api/v1/revenue` | Loop schemas, aggregate `orders` | Medium |
| `GET /api/v1/analytics/admin/summary` | Loop schemas, count `users` + `orders` | Medium |
| `GET /api/v1/admin/users/:restaurantId` | Direct query into single schema | None |

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
- [ ] `POST /api/v1/restaurants` creates `rest_<slug>` schema with 18 tables
- [ ] New restaurant has default seed data (owner, rider, table, categories, menu, customer)
- [ ] Tenant middleware sets `search_path` — `GET /menus` resolves to tenant schema
- [ ] Admin middleware resets `search_path` — super-admin routes don't leak tenant data
- [ ] `GET /api/v1/admin/users` returns users from all active schemas
- [ ] `GET /api/v1/revenue` aggregates orders across all schemas
- [ ] `GET /api/v1/analytics/admin/summary` counts users + orders across schemas
- [ ] `GET /api/v1/restaurants/qr?type=delivery` returns valid PNG
- [ ] No `console.log` statements in seed or template code
- [ ] No git mutations executed automatically

---

*This document is the living standard for JustSearch backend development. All code must conform to these rules.*
