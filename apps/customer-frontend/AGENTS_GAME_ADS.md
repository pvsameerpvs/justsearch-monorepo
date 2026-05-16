# Game Advertisement Strategy — Agent Guide

> **Location**: Cross-app (justsearch-admin → backend → customer-frontend)
> **Apps Involved**: `justsearch-admin` (create), `apps/backend` (store), `customer-frontend` (display)
> **Revenue Model**: Platform takes percentage cut per impression/completion

---

## 1. Architecture Overview

```
[justsearch-admin]              [Backend]                       [Customer-Frontend]
      |                              |                                |
  /ads page                     public.advertisements            AdOverlay component
  AdFormContainer  ──POST────>  ──store──>  DB  <────GET────  reads campaigns
      |                              |                                |
  Title, Company,       name, type, imageUrl,               filters by gameId +
  Media, Duration,      targetRestaurants,                    restaurantId +
  Games, Type           isActive, dates                       isActive
```

### Revenue Split Model

| Campaign Type | Restaurant Share | Platform Share |
|--------------|-----------------|----------------|
| `restaurant_brought` | 60% | 40% |
| `platform` | 40% | 60% |

---

## 2. Admin Campaign Creation (`justsearch-admin /ads`)

### 2.1 Form Fields

| # | Field | UI Type | Details | DB Column |
|---|-------|---------|---------|-----------|
| 1 | Media Type | 3 pills (Image/Video/GIF) | Toggle between image/video/gif | `image_url` |
| 2 | Media Upload | Drag-and-drop dropzone | Accepts image/*, video/*, gif | `image_url` |
| 3 | Campaign Type | 2-button toggle | `restaurant_brought` or `platform` | `type` |
| 4 | Ad Title | Text input | e.g. "Summer Fragrance" | `name` |
| 5 | Client Name | Text input | e.g. "Ahmed Al-Rashid" | `content` (description) |
| 6 | Company Name | Text input | e.g. "Desert Bloom Perfumes" | stored in `name` |
| 7 | Duration | Number input | In seconds, default 15 | Not stored in DB |
| 8 | Restaurant | Dropdown | Only shown for `restaurant_brought` | `target_restaurants` |
| 9 | Target Games | 5 toggle buttons | Game IDs the ad runs on | Not stored in DB |

### 2.2 Backend DB Schema (`public.advertisements`)

```typescript
// Drizzle ORM definition
export const advertisements = pgTable('advertisements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),             // Ad title + company
  type: varchar('type', { length: 50 }).notNull(),              // 'restaurant_brought' | 'platform'
  content: varchar('content', { length: 2000 }),                 // Description text
  imageUrl: varchar('image_url', { length: 500 }),               // Media file URL
  targetRestaurants: jsonb('target_restaurants').default('[]'),  // Restaurant IDs
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 2.3 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/v1/advertisements` | super_admin | List all campaigns |
| `POST` | `/api/v1/advertisements` | super_admin | Create campaign |
| `PATCH` | `/api/v1/advertisements/:id` | super_admin | Update campaign |
| `DELETE` | `/api/v1/advertisements/:id` | super_admin | Delete campaign |

**POST/PATCH request body (Zod schema):**
```typescript
{
  name: string;                          // Required
  type: string;                          // Required - 'restaurant_brought' | 'platform'
  content?: string;                      // Description
  imageUrl?: string;                     // Media URL
  targetRestaurants?: string[];          // JSONB array of restaurant IDs
  isActive?: boolean;
  startDate?: string;                    // ISO datetime
  endDate?: string;                      // ISO datetime
}
```

---

## 3. Customer-Frontend Ad Display (`customer-frontend`)

### 3.1 Where Ads Display

Ads appear as **full-screen interstitials** during game play. Two trigger points:

| Trigger | Component | When |
|---------|-----------|------|
| Game ends | `GameAdOverlays` → `AdOverlay` | After game over, before points are awarded |
| Back navigation | `GameAdOverlays` → `AdOverlay` | When user tries to leave mid-game |

### 3.2 Ad Overlay Data Shape (`CampaignItem`)

The customer-frontend ad system expects this shape (defined inline in `ad-overlay.tsx`):

```typescript
interface CampaignItem {
  id: string;                          // UUID from DB
  isActive: boolean;                   // Campaign active toggle
  assignedGames: string[];             // Game IDs this ad runs on (e.g. ["vex-runner"])
  type: string;                        // "platform" | "restaurant_brought"
  restaurantId: string | null;         // Target restaurant (null for platform)
  title: string;                       // Ad headline
  companyName: string;                 // Sponsor name
  mediaType: string;                   // "image" | "video" | "gif"
  mediaUrl: string;                    // URL or emoji fallback
  duration: number;                    // Display time in MILLISECONDS
  description?: string;                // Sub-text
}
```

### 3.3 Ad Filtering Logic

```typescript
const eligible = campaigns.filter((c: CampaignItem) =>
  c.isActive === true &&                                    // Must be active
  c.assignedGames.includes(gameId) &&                       // Must target this game
  (c.type === "platform" || c.restaurantId === restaurantId) // Platform or matches restaurant
);
```

### 3.4 Fallback (No Ads Configured)

When no campaigns match, a hardcoded fallback shows:

```typescript
const fallback = [{
  id: "fb-1",
  title: "Special Offer",
  description: "Get 20% off!",
  mediaUrl: "🍽️",         // Shows as giant emoji
  mediaType: "image",
  duration: 5000,           // 5 seconds (milliseconds)
  companyName: "Restaurant"
}];
```

### 3.5 Media Rendering

| `mediaType` | `mediaUrl` is valid URL? | Renders As |
|-------------|------------------------|------------|
| `video` | — | `<video>` element with autoPlay, muted toggle |
| `image` or `gif` | Yes | `next/image` with fill + object-cover |
| `image` or `gif` | No | Giant emoji text (6xl) |
| anything else | — | Giant emoji text (6xl) |

**URL validation check:**
```typescript
const isValidUrl = mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://") || mediaUrl.startsWith("/");
```

---

## 4. Ad Playback Flow

```
User plays game → game ends
  → onAward(result) called
  → showAdOnGameEnd = true
  → GameAdOverlays renders <AdOverlay>
  → AdOverlay reads localStorage("ad-campaign-store")
  → Filters eligible campaigns
  → Plays ads sequentially (1 of N, 2 of N, ...)
  → For each ad:
      1. Records impression (Zustand analytics store)
      2. Shows media for `duration` ms
      3. User can skip or timer completes
      4. Records skip or complete
  → On last ad complete:
      onComplete callback fires
      → processAward(pendingAward)
      → Game continues (or returns to game list)
```

### Multiple Ads Queue

If multiple campaigns match the filter criteria, they play **one after another**:
- "Ad 1 of 3", "Ad 2 of 3", "Ad 3 of 3"
- Skip button shows "Skip Ad" for intermediate ads, "Continue" for the last one
- Timer resets between ads

---

## 5. Analytics Tracking

### 5.1 Event Types

| Event | When Triggered | Example |
|-------|---------------|---------|
| `impression` | When a new ad index is shown (useEffect) | `{ campaignId: "abc", type: "impression", gameId: "vex-runner" }` |
| `complete` | When ad timer reaches 100% | `{ campaignId: "abc", type: "complete", gameId: "vex-runner" }` |
| `skip` | When user clicks skip button | `{ campaignId: "abc", type: "skip", gameId: "vex-runner" }` |

### 5.2 Current State

Events are collected in a **Zustand in-memory store** (`useAdAnalyticsStore`):
- Accumulated client-side only
- **NOT sent to any backend API**
- Lost on page refresh

The admin `AdCampaign` type has `impressions`, `skips`, `completions`, and `revenue` fields but there is **no backend endpoint** to receive or aggregate analytics yet.

---

## 6. Known Integration Gaps

| # | Issue | Impact | Recommended Fix |
|---|-------|--------|-----------------|
| 1 | Admin form sends `AdCampaignFormData` (title, clientName, mediaUrl) but backend expects `createSchema` (name, type, imageUrl) | **POST requests fail** — field names don't match | Map admin form fields to DB schema before sending |
| 2 | Customer-frontend reads ads from **localStorage** not from backend API | Ads created in admin NEVER appear on customer site | Create `GET /api/v1/advertisements/active?gameId=X&restaurantId=Y` public endpoint. Fetch in `ad-overlay.tsx` instead of `readCampaigns()` |
| 3 | Duration unit mismatch: admin stores **seconds** (default 15), ad timer uses **milliseconds** | Admin sets 15s → ad plays for 15ms (instant) | Convert duration: `duration * 1000` in `ad-overlay.tsx` or store as ms in DB |
| 4 | Assigned games not in DB schema | Game targeting is lost on save | Add `assigned_games` JSONB column to advertisements table |
| 5 | No analytics report endpoint | Admin dashboard shows 0 impressions | Create `POST /api/v1/analytics/ads` endpoint. Send events in batches every 60s |
| 6 | Fallback impression guard bug: checks `startsWith("fallback")` but fallback id is `"fb-1"` | Fallback impressions are tracked (minor) | Change to `startsWith("fb")` for consistency |

### 6.1 Priority Fix Order

| Priority | Task | Files |
|----------|------|-------|
| P0 | Fix field mapping in admin form → backend API | `ad-form-container.tsx`, `ad.routes.ts` |
| P0 | Create public endpoint for customer ads | `ad.routes.ts` (new route) |
| P0 | Fetch ads from API instead of localStorage | `ad-overlay.tsx` |
| P1 | Add `assigned_games` column to advertisements | DB migration + schema |
| P1 | Fix duration unit (seconds ↔ milliseconds) | `ad-form-container.tsx` default: `15 * 1000` |
| P2 | Create analytics reporting endpoint | New `ad-analytics.routes.ts` |
| P2 | Send analytics events to backend | `useAdAnalyticsStore` → periodic POST |

---

## 7. Cross-Platform Links

| Link | From | To | Data |
|------|------|-----|------|
| Admin → Backend | `AdFormContainer.handleSave()` | `POST /api/v1/advertisements` | Campaign form data |
| Backend → Customer | `GET /api/v1/advertisements` | `AdOverlay.readCampaigns()` | Campaign list filtered by game + restaurant |
| Customer → Backend | `useAdAnalyticsStore` | `POST /api/v1/analytics/ads` | Impression/skip/complete events |
| Admin Analytics | `GET /api/v1/analytics/admin/summary` | `AdCampaignStatsCards` | `activeCampaigns` + `totalCampaigns` |

---

## 8. Build Checklist

- [ ] Admin form correctly maps fields to backend schema
- [ ] Admin form sends `assignedGames` + `duration` alongside DB fields
- [ ] Customer-frontend fetches ads from API (not localStorage)
- [ ] Ad filtering matches by `gameId`, `restaurantId`, `isActive`
- [ ] Analytics events are sent to backend
- [ ] Admin dashboard shows real impression/completion data
- [ ] `duration` is in correct units (milliseconds everywhere)
- [ ] `tsc --noEmit` passes across all 3 apps
- [ ] Fallback ad shows when API returns empty list
- [ ] No `console.log`
- [ ] No `: any` types
- [ ] All components ≤80 lines

---

*This document maps the complete ad strategy from admin creation through backend storage to customer display. Use it to close the integration gaps between the three apps.*
