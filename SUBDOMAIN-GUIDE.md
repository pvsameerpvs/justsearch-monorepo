# JustSearch Subdomain Architecture Guide

## How Multi-Tenant Domains Work

### Domain Patterns

| Platform | Domain Pattern | Real Example |
|---|---|---|
| **justsearch-admin** | `mydomain.com` | `justsearch.com` |
| **customer-frontend** | `[restaurant].mydomain.com` | `mosaic-table.justsearch.com` |
| **restaurant-dashboard** | `[restaurant]-admin.mydomain.com` | `mosaic-table-admin.justsearch.com` |
| **delivery-portal** | `[restaurant]-delivery.mydomain.com` | `mosaic-table-delivery.justsearch.com` |

---

## DNS Configuration Required

### For Production (Cloudflare/Namecheap/GoDaddy)

Add these DNS records:

```
# A Record - Points all subdomains to your server
*.mydomain.com          A     YOUR_SERVER_IP

# Or if using Vercel/Netlify (recommended)
*.mydomain.com          CNAME your-project.vercel.app
```

**Vercel handles wildcards automatically.** Just add:
```
*.mydomain.com → CNAME → cname.vercel-dns.com
```

### For Local Development

Edit `/etc/hosts` file on your computer:

```bash
# Add these lines
127.0.0.1  localhost
127.0.0.1  mosaic-table.localhost
127.0.0.1  spice-garden.localhost
127.0.0.1  mosaic-table-admin.localhost
127.0.0.1  mosaic-table-delivery.localhost
127.0.0.1  mydomain.localhost
```

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux:** `/etc/hosts`

---

## How Subdomain Resolution Works

### Step 1: Browser Opens Domain

```
User types: https://mosaic-table.justsearch.com/menu

Browser sends:
  Host header: "mosaic-table.justsearch.com"
  URL: /menu
```

### Step 2: Next.js Middleware Reads Host

**customer-frontend middleware (`apps/customer-frontend/middleware.ts`):**
```typescript
const host = request.headers.get('host') ?? '';
// host = "mosaic-table.justsearch.com"

if (host.endsWith('.mydomain.com')) {
  subdomain = host.replace('.mydomain.com', '');
  // subdomain = "mosaic-table"
}
```

**restaurant-dashboard resolver (`apps/restaurant-dashboard/lib/get-current-restaurant.ts`):**
```typescript
const host = headers().get('host') ?? '';
// host = "mosaic-table-admin.justsearch.com"

if (host.endsWith('-admin.mydomain.com')) {
  subdomain = host.replace('-admin.mydomain.com', '');
  // subdomain = "mosaic-table"
}
```

**delivery-portal resolver (`apps/delivery-portal/lib/portal-context.ts`):**
```typescript
const host = headers().get('host') ?? '';
// host = "mosaic-table-delivery.justsearch.com"

if (host.endsWith('-delivery.mydomain.com')) {
  subdomain = host.replace('-delivery.mydomain.com', '');
  // subdomain = "mosaic-table"
}
```

### Step 3: Backend Queries Database

```sql
-- Backend receives subdomain "mosaic-table"
SELECT id, name, slug, schema_name, status, theme, settings
FROM public.restaurants
WHERE subdomain = 'mosaic-table';

-- Returns:
-- id: '550e8400-e29b-41d4-a716-446655440000'
-- name: 'Mosaic Table'
-- slug: 'mosaic-table'
-- schema_name: 'rest_mosaic'
-- status: 'active'
-- theme: { brandColor: '15 118 110', ... }
```

### Step 4: Tenant Context Attached to Request

```typescript
req.tenant = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  slug: 'mosaic-table',
  subdomain: 'mosaic-table',
  schemaName: 'rest_mosaic',
  status: 'active',
};
```

### Step 5: All Database Queries Filter by Tenant

```typescript
// Every query MUST include restaurantId filter
const items = await db
  .select()
  .from(menuItems)
  .where(
    and(
      eq(menuItems.restaurantId, req.tenant.id),  // ← THIS IS CRITICAL
      eq(menuItems.isAvailable, true)
    )
  );
```

**Without this filter, one restaurant could see another restaurant's data.**

---

## Environment Variables

```
# All apps need this
NEXT_PUBLIC_BASE_DOMAIN=mydomain.com

# Backend needs this
DATABASE_URL=postgresql://...
JWT_SECRET=minimum-32-characters-long-secret

# Frontend needs this
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Local Development Setup

### Step 1: Add to /etc/hosts

```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1  localhost
127.0.0.1  mosaic-table.localhost
127.0.0.1  mosaic-table-admin.localhost
127.0.0.1  mosaic-table-delivery.localhost
127.0.0.1  mydomain.localhost
```

### Step 2: Start All Apps

Terminal 1 - Backend:
```bash
pnpm --filter backend dev
# Runs on: http://localhost:3001
```

Terminal 2 - Customer Frontend:
```bash
pnpm --filter customer-frontend dev
# Runs on: http://localhost:3000
```

Terminal 3 - Restaurant Dashboard:
```bash
pnpm --filter restaurant-dashboard dev
# Runs on: http://localhost:3002
```

Terminal 4 - Delivery Portal:
```bash
pnpm --filter delivery-portal dev
# Runs on: http://localhost:3004
```

Terminal 5 - Admin:
```bash
pnpm --filter justsearch-admin dev
# Runs on: http://localhost:3003
```

### Step 3: Test URLs

| URL | Expected Result |
|---|---|
| `http://mosaic-table.localhost:3000` | Mosaic Table customer site |
| `http://mosaic-table-admin.localhost:3002` | Mosaic Table staff dashboard |
| `http://mosaic-table-delivery.localhost:3004` | Mosaic Table rider portal |
| `http://mydomain.localhost:3003` | Super admin platform |

---

## How Data Flows Between Subdomains

### 1. Admin Creates Restaurant

```
justsearch-admin (mydomain.com)
  → POST /api/v1/restaurants
    → Backend inserts into public.restaurants
    → Subdomain reserved: "mosaic-table"
    → Schema created: "rest_mosaic"
    → Owner account created in staff table
```

### 2. Customer Visits Restaurant

```
customer-frontend (mosaic-table.mydomain.com)
  → Middleware extracts "mosaic-table"
  → Backend queries: SELECT * FROM restaurants WHERE subdomain = 'mosaic-table'
  → Renders Mosaic Table branding, menu, games
```

### 3. Staff Manages Restaurant

```
restaurant-dashboard (mosaic-table-admin.mydomain.com)
  → Extracts "mosaic-table" (removes "-admin")
  → Staff logs in with owner/manager credentials
  → Edits menu → Backend updates menu_items WHERE restaurant_id = mosaic-id
  → Changes immediately visible to customers
```

### 4. Rider Delivers Orders

```
delivery-portal (mosaic-table-delivery.mydomain.com)
  → Extracts "mosaic-table" (removes "-delivery")
  → Rider logs in
  → Sees assigned orders
  → Updates status: picked_up → in_transit → delivered
  → Customer sees status updates in real-time
```

---

## Common Issues & Solutions

### Issue 1: "Restaurant not found" Error
**Cause:** Subdomain doesn't match any `public.restaurants.subdomain` value
**Fix:** Check database: `SELECT subdomain FROM public.restaurants;`
**Also check:** Case sensitivity — subdomains are lowercase

### Issue 2: Middleware Not Running
**Cause:** Next.js middleware only runs on certain paths
**Fix:** Check `middleware.ts` matcher config:
```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Issue 3: CORS Errors Between Ports
**Cause:** Frontend on port 3000 calling backend on port 3001
**Fix:** Backend `app.ts` must have:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3004'],
  credentials: true,
}));
```

### Issue 4: Cookie Not Sent
**Cause:** Missing `credentials: 'include'` in fetch
**Fix:** All API calls must include:
```typescript
fetch(url, { credentials: 'include' });
```

### Issue 5: SSL Required in Production
**Cause:** Browsers block cookies on HTTP (except localhost)
**Fix:** Use HTTPS in production. Let's Encrypt is free.
Local dev: use `http://*.localhost` (browsers allow HTTP on localhost)

---

## Deployment Checklist

Before going live:

- [ ] Domain purchased and DNS configured
- [ ] Wildcard SSL certificate installed
- [ ] `.env` updated with real `NEXT_PUBLIC_BASE_DOMAIN`
- [ ] Backend `.env` updated with real `DATABASE_URL`
- [ ] `db:push` run against production database
- [ ] `db:seed` run to create first restaurant
- [ ] All 4 apps deployed (Vercel recommended)
- [ ] Test: `curl https://your-restaurant.yourdomain.com/api/v1/restaurants/current`
- [ ] Test: `curl https://your-restaurant-admin.yourdomain.com` (should redirect to login)

---

End of Subdomain Architecture Guide.
