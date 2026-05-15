# JustSearch Admin Agent Guide

> **App**: `apps/justsearch-admin`
> **Domain**: `mydomain.com` (root domain, no subdomain)
> **Type**: Next.js App Router
> **Scope**: Platform super-admin for managing all restaurants

This agent handles the platform-level administration: restaurant onboarding, global settings, game management, ad campaigns, revenue tracking, and user oversight.

---

## 1. Architecture Overview

```
Request Flow:
root domain (mydomain.com)
    → middleware.ts (no tenant resolution — this is super-admin)
    → layout.tsx (async RootLayout)
        → AdminSidebar (left rail navigation)
        → main content area
    → page.tsx
        → DashboardContainer (fetches platform-wide stats)
```

**Key principle**: This is the control tower. It sees ALL restaurants, ALL users, ALL revenue. No tenant filtering.

---

## 2. Golden Rules

1. **No tenant context.** This app does NOT use `req.tenant`. It queries ALL data across all restaurants.
2. **Super-admin only.** All routes require `type: 'super_admin'` in JWT.
3. **Onboarding wizard.** Creating a restaurant must be a guided multi-step flow, not a single form.
4. **Audit everything.** Every action (create restaurant, modify game, delete ad) → `audit_logs`.
5. **Read-only analytics.** Revenue, user counts, order volumes — all aggregated from tenant tables.
6. **Impersonation capability.** Super-admin can "log in as" any restaurant to debug issues.

---

## 3. File Structure Standards

```
app/
├── page.tsx                    # Dashboard: platform overview
├── layout.tsx                  # AdminSidebar + main content
├── globals.css
├── ads/
│   └── page.tsx                # Ad campaign manager
├── analytics/
│   └── page.tsx                # Platform-wide analytics
├── games/
│   └── page.tsx                # Game catalog management
├── restaurants/
│   └── page.tsx                # Restaurant list + onboarding
├── revenue/
│   └── page.tsx                # Revenue breakdown by restaurant
├── settings/
│   └── page.tsx                # Platform settings
├── users/
│   └── page.tsx                # All users across platform
└── users/
    └── [restaurantId]/
        └── page.tsx            # Users for specific restaurant

components/
├── admin-sidebar.tsx           # Left navigation
├── admin-sidebar-footer.tsx    # User info + logout
├── admin-stats.tsx             # Platform stat cards
├── dashboard/
│   ├── dashboard-container.tsx
│   ├── dashboard-presenter.tsx
│   ├── dashboard-stats-row.tsx
│   ├── dashboard-revenue-chart.tsx
│   ├── dashboard-restaurants-snapshot.tsx
│   ├── dashboard-campaign-snapshot.tsx
│   └── dashboard-activity-feed.tsx
├── restaurant/
│   ├── restaurant-list-page.tsx
│   ├── restaurant-create-form.tsx
│   ├── restaurant-detail-drawer.tsx
│   ├── restaurant-detail-form.tsx
│   ├── restaurant-detail-qr.tsx
│   ├── restaurant-row.tsx
│   ├── restaurant-search-bar.tsx
│   └── ...
├── game/
│   ├── game-container.tsx
│   ├── game-presenter.tsx
│   ├── game-list.tsx
│   ├── game-card.tsx
│   ├── game-header.tsx
│   └── game-empty.tsx
├── ads/
│   ├── ad-campaign-container.tsx
│   ├── ad-campaign-presenter.tsx
│   ├── ad-campaign-table.tsx
│   ├── ad-campaign-row.tsx
│   ├── ad-campaign-row-actions.tsx
│   ├── ad-modal.tsx
│   ├── ad-form-container.tsx
│   ├── ad-form-presenter.tsx
│   ├── ad-form-field.tsx
│   ├── ad-form-details.tsx
│   ├── ad-media-upload.tsx
│   ├── ad-media-dropzone.tsx
│   ├── ad-media-thumbnail.tsx
│   ├── ad-preview-card.tsx
│   ├── ad-performance-table.tsx
│   ├── ad-performance-row.tsx
│   ├── ad-campaign-stats-cards.tsx
│   └── ...
├── analytics/
│   ├── analytics-container.tsx
│   ├── analytics-presenter.tsx
│   ├── analytics-stats-cards.tsx
│   ├── analytics-revenue-chart.tsx
│   ├── analytics-top-restaurants.tsx
│   ├── analytics-top-games.tsx
│   └── analytics-ad-performance.tsx
├── revenue/
│   ├── revenue-container.tsx
│   ├── revenue-presenter.tsx
│   ├── revenue-stats-cards.tsx
│   ├── revenue-chart.tsx
│   ├── revenue-chart-utils.ts
│   ├── revenue-restaurant-row.tsx
│   ├── revenue-top-restaurants.tsx
│   ├── revenue-ad-split.tsx
│   ├── revenue-split-panel.tsx
│   └── revenue-card.tsx
├── settings/
│   ├── settings-container.tsx
│   ├── settings-presenter.tsx
│   ├── settings-tabs.tsx
│   ├── settings-section-header.tsx
│   ├── settings-general.tsx
│   ├── settings-billing.tsx
│   ├── settings-games.tsx
│   ├── settings-revenue.tsx
│   ├── settings-restaurants.tsx
│   ├── settings-security.tsx
│   └── settings-notifications.tsx
└── users/
    ├── user-container.tsx
    ├── restaurant-users-page-container.tsx
    ├── restaurant-users-presenter.tsx
    ├── restaurant-user-table.tsx
    ├── restaurant-user-table-row.tsx
    ├── user-points-table.tsx
    ├── user-status-badge.tsx
    ├── user-game-points-bar.tsx
    ├── user-empty.tsx
    └── restaurant-not-found.tsx
```

---

## 4. Component Rules (Max 80 Lines)

| Type | Max Lines |
|------|-----------|
| Page | 30 |
| Container | 60 |
| Presenter | 50 |
| Table Row | 40 |
| Card | 40 |
| Form | 60 |
| Modal | 50 |
| Chart | 50 |

---

## 5. Auth & Role Model

### 5.1 Login Flow
```
1. User opens mydomain.com
2. AuthGuard checks JWT cookie
   → If super_admin: show dashboard
   → If missing/wrong role: redirect to /login
3. Login page: username + password
4. Backend checks public.super_admins table
5. Returns JWT with { userId, role: 'super_admin', type: 'super_admin' }
```

### 5.2 Role Enforcement
Every API call must check:
```typescript
if (req.auth?.type !== 'super_admin') {
  return res.status(403).json({ error: 'Super admin access required' });
}
```

### 5.3 Restaurant Onboarding Flow
```
Step 1: Basic Info
  → Name, slug, subdomain
  → Validate: slug unique, subdomain unique

Step 2: Contact & Location
  → Address, phone, email
  → Google Maps integration

Step 3: Theme & Branding
  → Brand colors, logo upload
  → Preview on mobile mockup

Step 4: Menu Skeleton
  → Create default categories
  → Add 3-5 sample items

Step 5: Staff Setup
  → Create owner account (username + temp password)
  → Send credentials via email

Step 6: QR Codes
  → Generate public QR (delivery)
  → Generate table QRs (based on table count)

Step 7: Launch
  → Set status: 'active'
  → Send welcome email
  → Redirect to restaurant dashboard
```

---

## 6. API Integration

### 6.1 Endpoints (Status)
| Endpoint | Status | Usage |
|---|---|---|
| `POST /api/v1/auth/login` | ❌ Not ready | Super admin login (backend returns 501 — needs super_admins table lookup) |
| `GET /api/v1/restaurants` | ✅ Ready | List all restaurants |
| `POST /api/v1/restaurants` | ✅ Ready | Create restaurant |
| `GET /api/v1/games` | ❌ Not ready | List games |
| `POST /api/v1/games` | ❌ Not ready | Create game |
| `GET /api/v1/advertisements` | ❌ Not ready | List ads |
| `POST /api/v1/advertisements` | ❌ Not ready | Create ad |
| `GET /api/v1/users` | ❌ Not ready | All users |

### 6.2 Aggregation Queries
For analytics, query across all tenants:
```sql
-- Total revenue today
SELECT SUM(total) FROM orders WHERE created_at >= TODAY;

-- Orders per restaurant
SELECT restaurant_id, COUNT(*) FROM orders GROUP BY restaurant_id;

-- Top menu items
SELECT name, COUNT(*) as order_count FROM order_items GROUP BY name ORDER BY order_count DESC LIMIT 10;
```

---

## 7. Build Checklist

- [ ] No component exceeds 80 lines
- [ ] All routes protected by super_admin check
- [ ] Onboarding wizard with 7 steps
- [ ] Restaurant list with search + filter + sort
- [ ] Analytics charts with real data
- [ ] Audit log for every mutation
- [ ] `tsc --noEmit` passes
- [ ] No `console.log`

---

## 8. Cross-Platform Links (How JustSearch Admin Connects to Other Portals)

### Link 1: justsearch-admin → customer-frontend
```
Admin creates restaurant (POST /api/v1/restaurants)
    → Backend creates public.restaurants row
    → Subdomain reserved: [restaurant].mydomain.com
    → Restaurant status: 'draft'
    → Admin completes onboarding wizard
    → Status changes to 'active'
    → Customer can now visit subdomain
    → customer-frontend resolves tenant + renders
```
**Data flow:** Admin onboarding is the prerequisite for all customer-facing activity.

### Link 2: justsearch-admin → restaurant-dashboard
```
Admin creates restaurant + owner account
    → Backend creates staff row with owner role
    → Owner credentials sent via email
    → Owner logs into [restaurant]-admin.mydomain.com
    → Full dashboard access
```
**Data flow:** Admin creates the keys that unlock the restaurant dashboard.

### Link 3: justsearch-admin → delivery-portal
```
Admin creates restaurant
    → Restaurant-dashboard creates delivery agents
    → Riders log into [restaurant]-delivery.mydomain.com
    → Delivery portal uses same tenant context
```
**Data flow:** Restaurant creation enables all 3 operational portals.

### Link 4: justsearch-admin → customer-frontend (Games)
```
Admin creates game in platform catalog (POST /api/v1/games)
    → Game appears in public.games table
    → Admin activates game for specific restaurant
    → INSERT into restaurant_games junction table
    → Customer sees game in /eat-play page
```
**Data flow:** Platform games distributed to restaurants by admin.

### Link 5: justsearch-admin → customer-frontend (Ads)
```
Admin creates ad campaign (POST /api/v1/advertisements)
    → Ad stored in public.advertisements
    → Admin targets specific restaurants
    → Customer sees ad in carousel / banner on homepage
```
**Data flow:** Ads managed centrally, displayed per restaurant.

### Link 6: All Portals → justsearch-admin (Analytics)
```
All portals generate data:
    → customer-frontend: orders, game sessions, reviews
    → restaurant-dashboard: menu changes, status updates, staff actions
    → delivery-portal: delivery assignments, GPS tracks, completion times
    → Backend aggregates all into per-tenant + platform-wide views
    → Admin sees: revenue charts, top restaurants, game performance, ad ROI
```
**Data flow:** Admin is the data sink for all platform activity.

### Link 7: justsearch-admin → All Portals (Impersonation)
```
Admin selects restaurant from list
    → Clicks "Impersonate" or "Preview"
    → Opens new tab: [restaurant].mydomain.com?admin_preview=true
    → Sees exactly what customer sees
    → Can also open [restaurant]-admin.mydomain.com with super-admin token
    → Debug issues without asking staff for screenshots
```
**Data flow:** Admin has god-mode visibility across all tenant portals.

---

## 9. Testing Commands

```bash
pnpm --filter justsearch-admin typecheck
pnpm --filter justsearch-admin dev  # Port 3003
```

## 9. Build Roadmap (What to Do Next)

### Phase 1: Fix Super Admin Login
| # | File | Action | Backend Needed |
|---|---|---|---|
| 1.1 | `app/login/page.tsx` | **Create** — username + password form | ❌ Fix backend first |
| 1.2 | `app/layout.tsx` | Add AuthGuard | None |
| 1.3 | `lib/auth-store.ts` | **Create** — super admin auth state | None |

### Phase 2: Connect Restaurant List & Onboarding
| # | File | Action | Backend Needed |
|---|---|---|---|
| 2.1 | `app/restaurants/page.tsx` | Fetch `GET /api/v1/restaurants` | ✅ Exists |
| 2.2 | `components/restaurant/restaurant-list-page.tsx` | Replace mock with real data | ✅ Exists |
| 2.3 | `components/restaurant/restaurant-create-form.tsx` | Call `POST /api/v1/restaurants` | ✅ Exists |
| 2.4 | `components/restaurant/restaurant-detail-drawer.tsx` | Show restaurant details | ✅ Exists |

### Phase 3: Connect Game Catalog
| # | File | Action | Backend Needed |
|---|---|---|---|
| 3.1 | `app/games/page.tsx` | Fetch `GET /api/v1/games` | ❌ Needs route |
| 3.2 | `components/game/game-list.tsx` | Replace mock with real data | ❌ Needs route |
| 3.3 | `components/game/game-card.tsx` | Toggle game active/inactive | ❌ Needs route |

### Phase 4: Connect Ad Campaigns
| # | File | Action | Backend Needed |
|---|---|---|---|
| 4.1 | `app/ads/page.tsx` | Fetch `GET /api/v1/advertisements` | ❌ Needs route |
| 4.2 | `components/ads/ad-campaign-table.tsx` | Replace mock with real data | ❌ Needs route |
| 4.3 | `components/ads/ad-form-container.tsx` | Call `POST /api/v1/advertisements` | ❌ Needs route |

### Phase 5: Connect Analytics & Users
| # | File | Action | Backend Needed |
|---|---|---|---|
| 5.1 | `app/analytics/page.tsx` | Fetch aggregated stats | ❌ Needs aggregation routes |
| 5.2 | `app/revenue/page.tsx` | Fetch revenue by restaurant | ❌ Needs aggregation routes |
| 5.3 | `app/users/page.tsx` | Fetch `GET /api/v1/users` | ❌ Needs route |

---

End of JustSearch Admin Agent Guide.
