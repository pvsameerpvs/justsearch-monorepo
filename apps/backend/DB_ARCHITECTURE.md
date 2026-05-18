# JustSearch Database Architecture

> **Date**: 2026-05-18  
> **Schema version**: `0002_swift_doctor_spectrum`  
> **Strategy**: Schema-per-Restaurant with global user identity

---

## 1. Overview

| Layer | Technology |
|-------|-----------|
| Database | Supabase PostgreSQL |
| ORM | Drizzle ORM + Drizzle Kit |
| Driver | `postgres` (npm) with SSL |
| Tenant Strategy | Schema-per-Restaurant |
| Auth | Custom JWT (bcrypt + jsonwebtoken) |

Each restaurant gets its own PostgreSQL schema (`rest_<slug>`). The `public` schema holds shared platform data and **global user identity**.

---

## 2. Schema Layout

```
Database: justsearch_dev
│
├── Schema: public                          ← shared platform data
│   ├── restaurants          (registry: subdomain → schema_name)
│   ├── games                (shared game catalog)
│   ├── advertisements       (shared ads catalog)
│   ├── restaurant_games     (junction)
│   ├── super_admins         (platform admin login)
│   ├── users                ← GLOBAL customer identity (phone is unique)
│   └── user_restaurants     ← junction: user ↔ restaurant role mapping
│
├── Schema: rest_mosaic                     ← Mosaic Table isolated data
│   ├── restaurant_tables, menu_categories, menus, menu_items
│   ├── promo_codes, orders, order_items, payments
│   ├── delivery_agents, delivery_assignments, staff
│   ├── loyalty_points, table_sessions, game_sessions
│   ├── audit_logs, otp_requests, addresses
│   └── (17 tenant tables — users & restaurant_users REMOVED)
│
└── Schema: rest_<slug>                     ← each new restaurant gets one
    └── (same 17 tables, empty + seeded on creation)
```

---

## 3. Public Schema Tables

### `public.restaurants`
Restaurant registry. Maps subdomain → schema_name.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | varchar(64) | unique |
| subdomain | varchar(64) | unique |
| schema_name | varchar(64) | unique, e.g. `rest_mosaic` |
| name | varchar(255) | |
| status | restaurant_status | draft / active / inactive / suspended |
| settings | jsonb | default `{}` |
| theme | jsonb | default `{}` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `public.users` — Global Identity
**One user, one phone, many restaurants.** No `restaurant_id` here.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | varchar(255) | not null |
| phone | varchar(20) | **unique**, not null — the global identifier |
| email | varchar(255) | unique, nullable |
| password_hash | varchar(255) | nullable |
| supabase_auth_id | uuid | nullable |
| is_active | boolean | default true |
| role | user_role | default `customer` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `public.user_restaurants` — Junction
Links a global user to a restaurant with a per-restaurant role.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → public.users.id (cascade) |
| restaurant_id | uuid | FK → public.restaurants.id (cascade) |
| role | user_role | customer / owner / staff / driver |
| permissions | jsonb | default `{}` |
| created_at | timestamptz | |

### `public.games`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | varchar(255) | |
| type | varchar(50) | |
| config | jsonb | default `{}` |
| is_active | boolean | default true |
| created_by | uuid | nullable |
| created_at | timestamptz | |

### `public.advertisements`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | varchar(255) | |
| type | varchar(50) | |
| media_type | varchar(10) | default `image` |
| content | varchar(2000) | |
| image_url | varchar(500) | |
| duration | integer | default 15 (seconds) |
| assigned_games | jsonb | default `[]` |
| target_restaurants | jsonb | default `[]` |
| is_active | boolean | default true |
| start_date | timestamptz | |
| end_date | timestamptz | |
| created_at | timestamptz | |

### `public.restaurant_games`
Junction: which restaurant gets which game.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → restaurants.id |
| game_id | uuid | FK → games.id |
| is_active | boolean | default true |
| start_date | timestamptz | |
| end_date | timestamptz | |
| created_at | timestamptz | |

### `public.super_admins`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| username | varchar(100) | unique |
| password_hash | varchar(255) | |
| name | varchar(255) | |
| email | varchar(255) | unique |
| is_active | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 4. Per-Tenant Schema Tables (rest_\<slug\>)

### `restaurant_tables`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| table_number | varchar(20) | |
| capacity | integer | default 4 |
| status | table_status | default `available` |
| qr_code_url | varchar(500) | |
| qr_payload | varchar(500) | |
| created_at | timestamptz | |

### `menu_categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| name | varchar(255) | |
| description | varchar(500) | |
| emoji | varchar(10) | |
| sort_order | integer | default 0 |
| status | menu_status | default `active` |
| created_at | timestamptz | |

### `menus`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| name | varchar(255) | |
| description | varchar(500) | |
| status | menu_status | default `active` |
| sort_order | integer | default 0 |
| created_at | timestamptz | |

### `menu_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| menu_id | uuid | FK → menus.id |
| category_id | uuid | FK → menu_categories.id (set null) |
| name | varchar(255) | |
| description | varchar(500) | |
| price | numeric(10,2) | |
| image_url | varchar(500) | |
| tags | jsonb | default `[]` |
| is_veg | boolean | default false |
| is_available | boolean | default true |
| sort_order | integer | default 0 |
| created_at | timestamptz | |

### `promo_codes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| code | varchar(50) | |
| type | promo_code_type | fixed / percentage |
| value | numeric(10,2) | |
| min_order | numeric(10,2) | default 0 |
| max_discount | numeric(10,2) | |
| is_active | boolean | default true |
| valid_from | timestamptz | |
| valid_until | timestamptz | |
| created_at | timestamptz | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| code | varchar(20) | unique |
| customer_id | uuid | FK → **public.users.id** (set null) ← cross-schema |
| customer_name | varchar(255) | |
| customer_phone | varchar(20) | |
| status | order_status | default `pending` |
| payment_status | payment_status | default `unpaid` |
| fulfillment_type | fulfillment_type | dine_in / delivery / pickup |
| source | order_source | default `direct_web` |
| subtotal | numeric(10,2) | |
| delivery_fee | numeric(10,2) | default 0 |
| tax | numeric(10,2) | default 0 |
| total | numeric(10,2) | |
| delivery_address | text | |
| lat | numeric(10,8) | |
| lng | numeric(10,8) | |
| notes | text | |
| driver_id | uuid | |
| payment_method | payment_method | |
| eta_minutes | integer | |
| table_id | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| order_id | uuid | FK → orders.id |
| menu_item_id | uuid | FK → menu_items.id (set null) |
| name | varchar(255) | |
| quantity | integer | |
| price | numeric(10,2) | |
| currency | varchar(3) | default `AED` |
| created_at | timestamptz | |

### `payments`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| order_id | uuid | FK → orders.id |
| amount | numeric(10,2) | |
| currency | varchar(3) | default `AED` |
| status | payment_status | default `pending` |
| method | payment_method | |
| transaction_ref | varchar(255) | |
| created_at | timestamptz | |

### `delivery_agents`
**Standalone login** — no `user_id` link.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| name | varchar(255) | |
| phone | varchar(20) | |
| username | varchar(100) | |
| password_hash | varchar(255) | |
| vehicle_type | vehicle_type | default `scooter` |
| status | delivery_agent_status | default `offline` |
| rating | numeric(2,1) | default 5.0 |
| completed_today | integer | default 0 |
| shift_label | varchar(100) | |
| is_active | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `delivery_assignments`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| order_id | uuid | FK → orders.id |
| agent_id | uuid | FK → delivery_agents.id |
| assigned_at | timestamptz | |
| picked_up_at | timestamptz | |
| delivered_at | timestamptz | |
| status | delivery_assignment_status | default `assigned` |
| created_at | timestamptz | |

### `staff`
**Standalone login** — no `user_id` link.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| name | varchar(255) | |
| username | varchar(100) | |
| password_hash | varchar(255) | |
| role | staff_role | owner / manager / cashier / kitchen_staff |
| permissions | jsonb | default `{}` |
| is_active | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `loyalty_points`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| customer_id | uuid | FK → **public.users.id** (cascade) ← cross-schema |
| points | integer | default 0 |
| total_earned | integer | default 0 |
| total_redeemed | integer | default 0 |
| updated_at | timestamptz | |

### `table_sessions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| table_id | uuid | FK → restaurant_tables.id |
| customer_id | uuid | FK → **public.users.id** (set null) ← cross-schema |
| session_token | varchar(255) | unique |
| started_at | timestamptz | |
| ended_at | timestamptz | |

### `game_sessions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| game_id | varchar(100) | |
| customer_id | uuid | FK → **public.users.id** (set null) ← cross-schema |
| score | integer | |
| points_awarded | integer | default 0 |
| level | integer | |
| scoring_version | varchar(20) | |
| played_at | timestamptz | |
| metadata | jsonb | default `{}` |

### `audit_logs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| action | varchar(100) | |
| entity_type | varchar(100) | |
| entity_id | uuid | |
| actor_id | uuid | |
| details | jsonb | default `{}` |
| created_at | timestamptz | |

### `otp_requests`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| restaurant_id | uuid | FK → public.restaurants.id |
| request_id | varchar(36) | unique |
| name | varchar(255) | |
| mobile | varchar(20) | |
| otp | varchar(10) | |
| attempts | integer | default 0 |
| created_at | timestamptz | |
| expires_at | timestamptz | |

### `addresses`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → **public.users.id** (cascade) ← cross-schema |
| label | varchar(20) | |
| address | text | |
| details | varchar(255) | |
| alternate_number | varchar(20) | |
| is_default | boolean | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 5. Enums

| Enum | Values |
|------|--------|
| restaurant_status | draft, active, inactive, suspended |
| user_role | customer, owner, staff, driver |
| staff_role | owner, manager, cashier, kitchen_staff |
| order_status | pending, confirmed, preparing, ready, out_for_delivery, completed, cancelled |
| payment_status | unpaid, pending, paid, failed, refunded, partially_refunded |
| fulfillment_type | dine_in, delivery, pickup |
| order_source | public_qr, table_qr, direct_web, dashboard |
| table_status | available, occupied, reserved, cleaning |
| menu_status | active, inactive |
| delivery_agent_status | online, busy, offline |
| delivery_assignment_status | assigned, picked_up, in_transit, delivered, cancelled |
| payment_method | card, cash, wallet |
| vehicle_type | bike, scooter, car |
| promo_code_type | fixed, percentage |

---

## 6. Tenant Resolution

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
Unqualified queries hit rest_mosaic.* first, public.* as fallback
```

**Critical behavior**: Because `users` is in `public` only, after `SET search_path TO rest_mosaic, public`, an unqualified `SELECT * FROM users` resolves to `public.users`. This is the intended cross-schema FK behavior.

---

## 7. Cross-Schema Foreign Keys

The following per-tenant columns reference `public.users.id`. PostgreSQL resolves the referenced table via `search_path` because the table name is unqualified in the constraint.

| Table | Column | Constraint |
|-------|--------|------------|
| orders | customer_id | orders_customer_id_users_id_fk |
| loyalty_points | customer_id | loyalty_points_customer_id_users_id_fk |
| game_sessions | customer_id | game_sessions_customer_id_users_id_fk |
| table_sessions | customer_id | table_sessions_customer_id_users_id_fk |
| addresses | user_id | addresses_user_id_users_id_fk |

> **Note**: When a new tenant schema is created, `CREATE TABLE rest_<slug>."orders" (LIKE public."orders" INCLUDING ALL)` copies the FK. Since `users` does not exist in `rest_<slug>` at creation time, PostgreSQL resolves `users` to `public.users` during the `CREATE TABLE` execution. Existing tenant schemas must be cleaned up to drop their stale cloned `users` and `restaurant_users` tables.

---

## 8. Auth & Identity Flow

### Customer (OTP)
```
POST /auth/otp/request
    → Creates otp_requests row in tenant schema

POST /auth/otp/verify
    → Validates OTP
    → Looks up public.users by phone (global)
    → If missing: INSERT INTO public.users
    → If no user_restaurants row for this restaurant: auto-insert
    → Signs JWT: { userId, role (from user_restaurants), restaurantId, type: 'customer' }
```

### Staff / Delivery
```
POST /auth/login
    → Queries tenant schema directly (staff or delivery_agents table)
    → Standalone username/password — no link to public.users
```

### Super Admin
```
POST /auth/login?type=super_admin
    → Queries public.super_admins
```

---

## 9. Super Admin Queries

Since `users` and `user_restaurants` are both in `public`, super-admin endpoints query them directly without schema looping:

| Endpoint | Query Approach |
|----------|---------------|
| `GET /api/v1/admin/users` | Query `public.user_restaurants` + `public.users` |
| `GET /api/v1/admin/users/:restaurantId` | Filter `user_restaurants` by restaurantId, join `users` |
| `GET /api/v1/revenue` | Loop schemas for `orders`, aggregate per schema |
| `GET /api/v1/analytics/admin/summary` | Loop schemas for counts |

---

## 10. Restaurant Creation Flow

```
POST /api/v1/restaurants
Body: { slug, subdomain, name }
    │
    ▼
1. INSERT INTO public.restaurants
   schema_name = rest_<slug>
    │
    ▼
2. CREATE SCHEMA IF NOT EXISTS "rest_<slug>"
    │
    ▼
3. Clone 17 tenant tables:
   CREATE TABLE "rest_<slug>"."restaurant_tables" (LIKE public."restaurant_tables" INCLUDING ALL);
   ... (no users, no restaurant_users)
    │
    ▼
4. Seed default data:
   - Owner staff (username: owner, password: owner123)
   - 1 delivery agent (username: rider, password: rider123)
   - 1 table (T1, capacity 4)
   - 4 menu categories (Starters, Mains, Desserts, Drinks)
   - 1 menu ("Main Menu")
    │
    ▼
Response: { restaurant: { id, slug, subdomain, schemaName, name, status } }
```

---

## 11. Migration Commands

```bash
# 1. Apply generated migration to Supabase
pnpm --filter backend db:migrate

# 2. Run TypeScript check
pnpm --filter backend typecheck

# 3. Clean up existing tenant schemas (drop stale users/restaurant_users tables)
pnpm --filter backend ts-node --transpile-only src/db/cleanup-tenant-schemas.ts
```

---

## 12. Table Count Summary

| Schema | Table Count | Notes |
|--------|-------------|-------|
| public | 8 | restaurants, games, advertisements, restaurant_games, super_admins, **users**, **user_restaurants** |
| rest_\<slug\> | 17 | all business tables except identity |

---

## 13. What Changed in Migration 0002

| Change | Reason |
|--------|--------|
| `users.restaurant_id` dropped | Users are global; restaurant link moves to `user_restaurants` |
| `restaurant_users` table dropped | Replaced by `public.user_restaurants` |
| `user_restaurants` table created | Junction table for user ↔ restaurant roles |
| `staff.user_id` dropped | Staff has standalone login |
| `delivery_agents.user_id` dropped | Riders have standalone login |
| `users.phone` made unique | Phone is the global customer identifier |
| `addresses.user_id` FK added | Cross-schema FK to `public.users` |
| `TENANT_TABLES` reduced to 17 | Removed `users`, `restaurant_users`; added `addresses` |
