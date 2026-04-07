# Customer Backend Project Documentation
## JustSearch Restaurant Activity - Shared Backend

This document describes the backend layer that powers the customer frontend and supplies shared data for restaurant dashboard and admin workflows.

Current implementation status:
- Express + TypeScript backend scaffold
- Base routes: `/health` and `/api/v1`
- Middleware: CORS, Helmet, JSON parsing, cookie parsing, centralized error handling

---

## 1. Overview

The backend is the source of truth for all restaurant, customer, session, game, reward, and redemption data.

It is responsible for:
- Resolving the restaurant from the request host or subdomain
- Serving public restaurant content without requiring login
- Creating and validating short-lived check-in tokens
- Managing active customer sessions for games and rewards
- Enforcing reward and game rules
- Storing points, wallet history, and redemption history
- Providing data used by the restaurant dashboard and JustSearch admin panel

The backend must never rely on the frontend for security decisions. The frontend may display state, but the backend must enforce it.

---

## 2. Main Purpose

### 2.1 Public restaurant data delivery
The backend should provide restaurant-specific branding, menu data, contact details, social links, and SEO metadata for public pages.

### 2.2 Session enforcement
The backend should only unlock game and reward actions after a valid check-in session is created and confirmed.

### 2.3 Gamification persistence
The backend should store game outcomes, scratch-card results, points, rewards, and redemption history.

### 2.4 Multi-app support
The same backend should support:
- Customer frontend
- Restaurant dashboard
- JustSearch admin

---

## 3. Backend Consumers

### 3.1 Customer frontend
Uses the backend for:
- Restaurant page data
- Login and registration
- Live/check-in flow
- Session state
- Games
- Scratch cards
- Rewards
- Redeem actions
- Customer profile and history

### 3.2 Restaurant dashboard
Uses the backend for:
- Restaurant branding updates
- Menu updates
- Reward creation
- Session monitoring
- Redemption approval

### 3.3 JustSearch admin
Uses the backend for:
- Platform-wide restaurant management
- Global rewards
- Abuse monitoring
- Reporting and moderation

---

## 4. Domain Structure and Tenant Resolution

Each restaurant should be resolved from its subdomain or host header.

Examples:
- `a.justsearch-restorantactivity.com`
- `b.justsearch-restorantactivity.com`
- `restaurantname.justsearch-restorantactivity.com`

Recommended resolution flow:
1. Read the incoming `Host` header.
2. Strip the port if present.
3. Match the subdomain against the restaurant record.
4. Load the restaurant branding and configuration.
5. Return `404` if no restaurant exists for that host.

Optional future support:
- Custom domains per restaurant
- Domain aliases
- Region-aware routing

---

## 5. User Types

### 5.1 Customer
A customer can:
- Register and log in
- View public restaurant content
- Scan a QR code
- Start a restaurant check-in session
- Play games
- Earn points
- Receive scratch-card offers
- Redeem rewards
- View profile and history

A customer cannot:
- Edit restaurant settings
- Edit platform settings
- Access protected admin routes

### 5.2 Restaurant staff or manager
Uses dashboard-approved endpoints for menu, branding, rewards, and redemption workflows.

### 5.3 JustSearch admin
Uses platform-level endpoints for moderation, platform configuration, and oversight.

---

## 6. Backend Functional Scope

### 6.1 Public access features
These should work without an active game session:
- Restaurant homepage data
- About and contact data
- Menu data
- Social links
- Branding assets
- Reward listings
- Login and register pages

### 6.2 Protected features
These require:
- Customer authentication
- Valid restaurant check-in session
- Non-expired session state

Protected actions:
- Play game
- Scratch card
- Claim points
- Claim offer
- Redeem reward
- Write to wallet history

---

## 7. Core Backend Flows

### 7.1 Landing flow
1. Customer scans a restaurant QR code.
2. QR opens the restaurant subdomain or a permanent route such as `/live`.
3. Backend resolves the restaurant from the host.
4. Backend returns public restaurant data.
5. Frontend renders the branded restaurant experience.

### 7.2 Check-in flow
1. Customer scans the in-store QR code.
2. QR opens the permanent `/live` route.
3. Backend generates a short-lived token.
4. Frontend redirects to `/checkin?token=...`.
5. Backend validates the token.
6. Backend creates an active restaurant session.
7. Protected game and reward actions become available.

### 7.3 Expiry flow
When the session expires:
- Public restaurant pages remain available
- Game and reward endpoints return a blocked state
- Frontend asks the user to rescan the QR code

Recommended message:
`Your game session has expired. Please scan the QR code again to continue.`

---

## 8. Authentication and Identity

### 8.1 Customer login options
Recommended options:
- Phone login with OTP
- Email login with OTP
- Password-based login if needed for a later phase

### 8.2 Auth responsibilities
The backend should:
- Register new customers
- Authenticate existing customers
- Issue secure session cookies or signed tokens
- Return the current authenticated customer
- Handle logout and session revocation

### 8.3 Recommended session style
For browser-based subdomain apps, cookie-based authentication is the best fit.

Recommended properties:
- HTTP-only
- Secure
- SameSite configured for the deployment model
- Domain-scoped when sharing across subdomains

---

## 9. Check-In and Session Model

### 9.1 Check-in token
A check-in token should:
- Be short-lived
- Be one-time use or tightly bounded
- Be tied to one restaurant
- Be tied to one session start

Recommended expiry:
- 2 to 5 minutes

### 9.2 Active restaurant session
A validated session should be tied to:
- Customer ID
- Restaurant ID
- Device or browser session
- Expiry time
- Last activity time

Recommended expiry:
- 15 to 20 minutes

Optional idle timeout:
- 10 minutes of inactivity

### 9.3 Session states
Suggested states:
- `public`
- `checked_in`
- `expired`
- `revoked`

### 9.4 Session end conditions
A session should end when:
- The expiry time is reached
- Idle timeout is reached
- The customer logs out
- The session is revoked by the backend
- Optional advanced validation fails

---

## 10. Security and Anti-Abuse Logic

The backend must protect against QR photo abuse and repeated reward misuse.

### 10.1 Required protections
- Permanent QR should open only the public live entry route
- `/live` should generate fresh short-lived tokens
- Tokens should expire quickly
- Game and reward actions should require an active session
- Session and redemption rules should be enforced server-side

### 10.2 Optional protections
- Location validation
- Wi-Fi/network validation
- Device fingerprinting
- Staff approval for high-value rewards
- Rate limiting for login, check-in, and game endpoints

### 10.3 Auditability
The backend should log:
- Check-in attempts
- Game plays
- Reward claims
- Redemption attempts
- Session expiry or revocation

---

## 11. Branding and Content APIs

Each restaurant should expose branding through backend APIs so frontend changes happen automatically when the dashboard is updated.

Recommended dynamic fields:
- Restaurant name
- Logo
- Hero image
- Theme colors
- Accent colors
- Typography choice
- Menu data or menu URL
- Contact number
- Email
- Address
- Social links
- Short description
- Opening hours
- SEO title and description

The backend should treat branding as editable dashboard data, not frontend-owned content.

---

## 12. Suggested API Surface

All routes below should live under the versioned API prefix, for example `/api/v1`.

### 12.1 Public restaurant APIs
- `GET /api/v1/restaurant/current`
- `GET /api/v1/restaurant/menu`
- `GET /api/v1/restaurant/rewards`
- `GET /api/v1/restaurant/meta`
- `GET /api/v1/live`

### 12.2 Authentication APIs
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/otp/send`
- `POST /api/v1/auth/otp/verify`

### 12.3 Check-in and session APIs
- `POST /api/v1/checkin/validate`
- `GET /api/v1/session/current`
- `POST /api/v1/session/end`

### 12.4 Game APIs
- `GET /api/v1/games`
- `POST /api/v1/games/play`
- `POST /api/v1/games/scratch`

### 12.5 Rewards APIs
- `GET /api/v1/rewards/wallet`
- `POST /api/v1/rewards/claim`
- `POST /api/v1/rewards/redeem`
- `GET /api/v1/rewards/history`

### 12.6 Profile APIs
- `GET /api/v1/profile`
- `PUT /api/v1/profile`
- `GET /api/v1/profile/history`

### 12.7 Restaurant dashboard and admin APIs
- `POST /api/v1/admin/restaurants/:id/branding`
- `PUT /api/v1/admin/restaurants/:id/menu`
- `POST /api/v1/admin/rewards`
- `POST /api/v1/admin/redemptions/:id/approve`

---

## 13. Data Model

The backend should persist the following core entities in PostgreSQL or an equivalent relational store.

### 13.1 Restaurant
Stores the tenant record.
- `id`
- `name`
- `slug`
- `subdomain`
- `status`
- `created_at`
- `updated_at`

### 13.2 Restaurant branding
Stores public visual and content data.
- `restaurant_id`
- `logo_url`
- `hero_image_url`
- `primary_color`
- `accent_color`
- `description`
- `opening_hours`
- `contact_phone`
- `contact_email`
- `address`

### 13.3 Customer
Stores the customer identity.
- `id`
- `name`
- `phone`
- `email`
- `auth_provider`
- `created_at`
- `updated_at`

### 13.4 Check-in token
Stores or represents the short-lived QR validation token.
- `id`
- `restaurant_id`
- `customer_id`
- `token_hash`
- `expires_at`
- `used_at`
- `created_at`

### 13.5 Customer session
Stores an active or expired restaurant session.
- `id`
- `customer_id`
- `restaurant_id`
- `device_id`
- `status`
- `expires_at`
- `last_activity_at`
- `created_at`

### 13.6 Game play
Stores each game attempt and its outcome.
- `id`
- `customer_id`
- `restaurant_id`
- `game_type`
- `result_type`
- `points_awarded`
- `reward_id`
- `created_at`

### 13.7 Reward
Stores both global and restaurant-specific rewards.
- `id`
- `scope`
- `restaurant_id`
- `title`
- `description`
- `reward_type`
- `points_cost`
- `status`
- `created_at`

### 13.8 Wallet entry
Stores points and reward balance changes.
- `id`
- `customer_id`
- `restaurant_id`
- `entry_type`
- `points_delta`
- `reference_type`
- `reference_id`
- `created_at`

### 13.9 Redemption
Stores reward redemption attempts and approvals.
- `id`
- `customer_id`
- `restaurant_id`
- `reward_id`
- `status`
- `approved_by`
- `approved_at`
- `created_at`

---

## 14. Standard Response Contract

The backend should return a consistent JSON shape so the frontend can render session and reward states reliably.

Recommended success response:

```json
{
  "success": true,
  "data": {}
}
```

Recommended error response:

```json
{
  "success": false,
  "message": "Session expired",
  "code": "SESSION_EXPIRED"
}
```

In development, stack traces may be included for debugging. In production, stack traces should be omitted.

Recommended HTTP statuses:
- `200` success
- `201` created
- `400` bad request
- `401` unauthorized
- `403` forbidden
- `404` not found
- `409` conflict
- `422` validation error
- `429` rate limited
- `500` server error

Suggested error codes:
- `RESTAURANT_NOT_FOUND`
- `AUTH_REQUIRED`
- `SESSION_REQUIRED`
- `SESSION_EXPIRED`
- `TOKEN_INVALID`
- `TOKEN_EXPIRED`
- `REWARD_NOT_ELIGIBLE`
- `ALREADY_PLAYED`
- `REDEMPTION_REJECTED`

---

## 15. Error and Empty States

The backend should provide clear failure reasons so the frontend can guide the user.

Examples:
- `Session expired. Please scan the QR code again.`
- `Please log in to continue.`
- `No rewards available right now.`
- `Scan the QR code inside the restaurant to unlock games and rewards.`
- `This restaurant page is unavailable.`

The backend should always distinguish between:
- Not logged in
- Logged in but no active session
- Logged in and session expired
- Logged in and session active but action not allowed

---

## 16. Recommended Tech Approach

### 16.1 Runtime and framework
Recommended stack:
- Node.js
- Express
- TypeScript
- Zod for validation
- cookie-parser
- helmet
- cors

### 16.2 Data layer
Recommended:
- PostgreSQL through Supabase or another managed Postgres provider
- Storage for menu assets, logos, and hero images

### 16.3 Why this fits
- Simple to deploy
- Works well with Next.js frontends
- Easy to version and validate APIs
- Good fit for multi-tenant restaurant data

---

## 17. Suggested Backend Folder Structure

```text
src/
  app.ts
  server.ts
  config/
  middleware/
  modules/
    auth/
    restaurants/
    sessions/
    games/
    rewards/
    profile/
    admin/
  lib/
  types/
  utils/
  validations/
```

Suggested module responsibilities:
- `auth`: login, register, OTP, logout
- `restaurants`: public branding, meta, menu, restaurant resolution
- `sessions`: check-in tokens, active session lifecycle
- `games`: game listing, play, scratch results
- `rewards`: wallets, claims, redemption, history
- `profile`: customer profile and history
- `admin`: restaurant and platform management

---

## 18. Suggested Data Needed by the Frontend

The frontend should be able to request and render the following data groups.

### 18.1 Restaurant data
- Restaurant ID
- Restaurant name
- Subdomain
- Logo
- Theme colors
- Banner image
- Description
- Contact details
- Menu data or menu URL
- Social links

### 18.2 Customer data
- User ID
- Name
- Phone or email
- Login status
- Points balance
- Reward wallet

### 18.3 Session data
- Active session state
- Session expiry time
- Current restaurant ID
- Session status
- Remaining time if available

### 18.4 Game data
- Available games
- Eligibility rules
- Daily limits
- Per-session limits
- Reward result

### 18.5 Reward data
- Reward list
- Reward type
- Restaurant scope
- Redemption rules
- Approval status

---

## 19. API Integration Requirements for the Frontend

The customer frontend should expect the backend to support these behaviors:

- Public page data should be available without login
- Menu and branding data should be cacheable
- Login should work independently from check-in
- Check-in should create a restaurant-scoped session
- Protected actions should return a clear blocked state when the session expires
- Session state should be easy to poll or refresh
- Game and reward mutations should be atomic and idempotent where needed
- Reward history should be available for profile and wallet pages

---

## 20. SEO and Meta Support

Because restaurant pages are public, the backend should supply:
- Dynamic page title per restaurant
- Meta description per restaurant
- Open Graph title and image
- Favicon or logo reference
- Canonical URL if needed

Example title:
- `Restaurant A | JustSearch Restaurant Activity`

---

## 21. MVP Scope

For the first backend version, the minimum scope should include:
- Restaurant resolution by subdomain
- Public restaurant branding and menu endpoints
- Customer register and login
- QR live/check-in flow
- Active session validation
- Game listing and play endpoint
- Scratch-card endpoint
- Rewards wallet endpoint
- Redeem endpoint
- Profile and history endpoints

---

## 22. Future Enhancements

Possible backend extensions:
- Leaderboards
- Daily streaks
- Visit history analytics
- Referral rewards
- Coupon wallet
- Push notification support
- Multi-language content
- Loyalty tier logic
- Location verification scoring
- Restaurant event campaigns
- Background jobs and queues

---

## 23. Final Functional Summary

The backend is the central trust layer for the customer experience.

Public area:
- Always available
- Restaurant data, branding, menu, contact, social links, and SEO metadata

Protected area:
- Available only after valid login and check-in session
- Games, scratch cards, reward claims, and reward redemption

Important rule:
- The restaurant website must remain publicly accessible at all times, but all game and reward actions must expire when the validated restaurant session expires.

---

## 24. One-Line Product Definition

The Customer Backend is a restaurant-aware, multi-tenant API that serves public restaurant content and securely unlocks games, points, and rewards only during a valid check-in session.
