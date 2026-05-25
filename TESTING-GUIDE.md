# 🛡️ Tenant Isolation Fix — Testing Guide

## What Was Fixed

A critical bug where `SET search_path` was set on one pooled PostgreSQL connection, but route handlers used different connections from the same pool. This caused orders and other tenant data to randomly leak into wrong restaurant schemas.

**Fix**: Every request now reserves one dedicated PostgreSQL connection. `search_path` is set on that same connection, and all queries in the request use it. After the response, the connection is reset to `public` and returned to the pool.

---

## Files Changed

### Backend (`apps/backend/`)

| File | Change |
|------|--------|
| `src/db/index.ts` | Added `createRequestDb()` helper |
| `src/middleware/tenant.middleware.ts` | **Complete rewrite** — reserve connection, set search_path, create `req.db`, cleanup on finish/close |
| `src/modules/orders/order-*.routes.ts` (7 files) | All tenant queries now use `req.db!` |
| `src/modules/menu/menu-*.routes.ts` (3 files) | All tenant queries now use `req.db!` |
| `src/modules/delivery/delivery-me.routes.ts` | `deliveryAgents` queries use `req.db!` |
| `src/modules/games/game-session.routes.ts` | `gameSessions` queries use `req.db!` |
| `src/modules/auth/auth-otp-*.routes.ts` + service | `otpRequests` queries use `req.db` |
| `src/modules/vouchers/voucher.routes.ts` | `promoCodes` queries use `req.db!` |
| `src/modules/analytics/analytics.routes.ts` | `orders`/`orderItems` queries use `req.db!` |

### Root (`/`)

| File | Purpose |
|------|---------|
| `setup-localhosts.sh` | Adds `naples.localhost` and `hotgrill.localhost` to `/etc/hosts` |
| `test-tenant-isolation.js` | Automated API test — places orders and verifies isolation |

---

## Step 1: Add Localhost Subdomains

```bash
sudo bash setup-localhosts.sh
```

This adds:
- `127.0.0.1 naples.localhost`
- `127.0.0.1 hotgrill.localhost`

---

## Step 2: Start the Backend

```bash
pnpm --filter backend dev
```

Runs on `http://localhost:3001`

---

## Step 3: Start the Customer Frontend

```bash
pnpm --filter customer-frontend dev
```

Runs on `http://localhost:3005`

---

## Step 4: Test in Browser

### Test A: Naples Restaurant
Open: `http://naples.localhost:3005`

1. Sign in with any phone number
2. Place an order
3. Go to Profile → Orders
4. Confirm order shows **"naples cafeteria"**

### Test B: Hotgrill Restaurant (if exists in DB)
Open: `http://hotgrill.localhost:3005`

1. Sign in with **same phone number**
2. Place an order
3. Go to Profile → Orders
4. Confirm order shows **"hotgrill"**

### Test C: Verify No Leakage
Open Supabase SQL Editor:

```sql
-- Find your recent naples orders
SELECT id, code, restaurant_id, customer_id, status, created_at
FROM rest_naples.orders
WHERE created_at > NOW() - INTERVAL '10 minutes';

-- Check hotgrill schema for leakage (should be ZERO for naples customer)
SELECT id, code, restaurant_id, customer_id
FROM rest_hotgrill.orders
WHERE customer_id = '<naples-customer-id>';
```

---

## Step 5: Automated API Test

Run this without opening the browser:

```bash
node test-tenant-isolation.js
```

This will:
1. Log in as customer on naples
2. Place an order
3. Log in as customer on hotgrill
4. Place an order
5. Fetch cross-restaurant order list
6. Verify each order shows the correct restaurant name

---

## Expected Result After Fix

| Before Fix | After Fix |
|------------|-----------|
| Orders randomly appear under wrong restaurant | Every order shows correct restaurant |
| Hotgrill order in `rest_naples.orders` | Hotgrill order in `rest_hotgrill.orders` |
| Intermittent "relation does not exist" errors | Zero errors |
| Staff sees wrong restaurant's orders | Staff only sees their restaurant's orders |

---

## Other Platforms (Also Work)

| Platform | Localhost URL | Slug Sent |
|----------|---------------|------------|
| Customer Frontend | `http://naples.localhost:3005` | `naples` |
| Restaurant Dashboard | `http://naples.localhost:3002` | `naples` |
| Delivery Portal | `http://naples.localhost:3004` | `naples` |
| JustSearch Admin | `http://localhost:3003` | *(none — super admin)* |

All platforms hit the same backend. The fix protects every request.

---

## Deploy to Production

1. **Push code** to your repository
2. **Railway redeploys** automatically (or manually trigger)
3. **Verify** by placing a test order on production
4. **Monitor** logs for any errors

No database migration needed. The fix is purely in application code.

---

## Rollback Plan (If Needed)

If anything breaks, revert `tenant.middleware.ts` to the old version:

```bash
git checkout HEAD -- apps/backend/src/middleware/tenant.middleware.ts
```

Then revert the route files that use `req.db!` back to `db.`:

```bash
git checkout HEAD -- apps/backend/src/modules/orders/
git checkout HEAD -- apps/backend/src/modules/menu/
git checkout HEAD -- apps/backend/src/modules/delivery/
git checkout HEAD -- apps/backend/src/modules/games/
git checkout HEAD -- apps/backend/src/modules/auth/
git checkout HEAD -- apps/backend/src/modules/vouchers/
git checkout HEAD -- apps/backend/src/modules/analytics/
git checkout HEAD -- apps/backend/src/db/index.ts
```

---

## Questions?

If the automated test fails or you see any errors, check:
1. Backend is running on port 3001
2. `DEBUG_OTP=true` in `apps/backend/.env`
3. Both restaurants exist in `public.restaurants` with `status = 'active'`
4. Both schemas (`rest_naples`, `rest_hotgrill`) exist with `orders` and `order_items` tables
