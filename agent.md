# JustSearch Standard Architecture Guide

This document defines the standard architecture for the JustSearch Restaurant Activity Platform. It is aligned with the current monorepo structure and focuses on multi-tenancy, QR-based ordering, clean operational flows, maintainable UI, and clean code standards.

## 1. Monorepo Applications

The platform uses a subdomain-based multi-tenant model while keeping separate responsibilities per workspace.

| Application | Workspace | Domain Pattern | Responsibility |
| :--- | :--- | :--- | :--- |
| **JustSearch Admin** | `apps/justsearch-admin` | `mydomain.com` | Super-admin onboarding, global settings, tenant support, and platform-level reporting. |
| **Customer Frontend** | `apps/customer-frontend` | `[restaurant].mydomain.com` | Public restaurant experience for menu, delivery ordering, loyalty, reviews, and games. |
| **Restaurant Dashboard** | `apps/restaurant-dashboard` | `[restaurant]-admin.mydomain.com` | Restaurant operations for menu, POS, tables, delivery assignment, and settings. |
| **Delivery Portal** | `apps/delivery-portal` | `[restaurant]-delivery.mydomain.com` | Delivery-agent execution portal for assigned orders, route status, and handoff updates. |
| **Backend API** | `apps/backend` | Internal service or API domain | Shared business logic, integrations, auth-aware APIs, and operational workflows. |

The restaurant dashboard remains the dispatch control center. The delivery portal is the focused execution workspace for delivery agents and should use the same tenant, order, and audit contracts as the dashboard.

## 2. Tenant Model and Security Boundary

Multi-tenancy must be enforced at both routing level and data level.

- Every restaurant has a unique `id`, `slug`, `subdomain`, and lifecycle `status`.
- Middleware resolves the incoming `Host` header into one restaurant context.
- The frontend may use the host to identify the tenant, but backend and database access must always enforce tenant isolation with `restaurant_id`.
- Every tenant-owned record should include `restaurant_id` directly or be reachable through a trusted parent relation.
- Cross-tenant access must never depend only on client-provided IDs.
- Sensitive actions such as refunds, role changes, menu publishing, and order cancellation should be audit logged.

### 2.1 Restaurant Lifecycle

When a restaurant is created from **JustSearch Admin**:

1. A unique `slug` and public/admin domains are reserved.
2. The core tenant record is created.
3. Default settings, menu skeleton, and operational preferences are initialized.
4. QR records are created for one public restaurant QR and each physical table.
5. The tenant remains `draft` or `inactive` until onboarding is complete.

## 3. Standard QR Strategy

The standard QR model is intentionally simple.

### 3.1 QR Types

| QR Type | Count Per Restaurant | Purpose | Standard Behavior |
| :--- | :--- | :--- | :--- |
| **Public Restaurant QR** | `1` | Delivery and public access | Opens the restaurant public domain and defaults to the delivery flow. |
| **Table QR** | `1` per table | Dine-in ordering | Opens the restaurant menu with a table identifier. |

### 3.2 QR Rules

- The public restaurant QR is the general QR used for posters, takeaway bags, storefronts, and online sharing.
- Table QR must be unique per table and include a `table` identifier in the URL.
- If a `table` parameter is present, the system must lock the flow to `dine_in`.
- If no `table` parameter is present, the public site should default to delivery ordering.
- Total QR codes per restaurant = `1 + number_of_tables`.

### 3.3 Marketing Tracking

Marketing attribution is optional and should not be modeled as a separate core QR type. If campaign tracking is needed later, use the existing public restaurant QR pattern with optional UTM parameters instead of introducing a dedicated Google Ads QR flow.

## 4. Core Product Flows

### 4.1 Public Delivery Flow

1. The customer opens `[restaurant].mydomain.com`.
2. The system resolves the restaurant from the host.
3. The public experience defaults to delivery ordering.
4. The customer selects items, adds address details, and places the order.
5. The order enters the restaurant dashboard with `fulfillment_type = delivery`.

### 4.2 Table Ordering Flow

1. The customer scans a table QR.
2. The system resolves both `restaurant_id` and `table_id`.
3. Delivery and pickup options remain hidden.
4. The order is created with `fulfillment_type = dine_in`.
5. The order appears in the dashboard with a clear table label for kitchen and POS handling.

### 4.3 Delivery Operations

1. Delivery orders are managed from the restaurant dashboard.
2. Staff assign delivery orders to delivery agents.
3. Delivery agents update status through the restricted `apps/delivery-portal` interface.
4. Customer tracking screens reflect status updates in near real time.

## 5. Roles and Access Model

The platform should use a simple, explicit role system.

| Role | Scope | Standard Access |
| :--- | :--- | :--- |
| `super_admin` | Platform-wide | Manage all restaurants, global settings, platform analytics, and support actions. |
| `owner` | Single restaurant | Full restaurant access including staff, billing, menu, and operational settings. |
| `manager` | Single restaurant | Day-to-day operations, order handling, menu updates, and reports. |
| `cashier` | Single restaurant | POS actions, order acceptance, and billing-related workflows. |
| `kitchen_staff` | Single restaurant | Kitchen queue visibility and order status updates only. |
| `delivery_agent` | Single restaurant | Assigned deliveries and delivery status updates only. |
| `customer` | Public | Ordering, loyalty, reviews, and game participation. |

The important standard is that access belongs to a role and a tenant at the same time. A user can only act inside restaurants they are explicitly mapped to.

## 6. Data Model Standards

Supabase/Postgres is a good fit, but the structure should be normalized enough for reporting, security, and long-term maintenance.

| Entity | Purpose | Standard Notes |
| :--- | :--- | :--- |
| `restaurants` | Core tenant record | Includes identity, branding, status, contact info, and theme settings. |
| `restaurant_users` | Tenant staff mapping | Maps authenticated users to a restaurant and role. |
| `restaurant_tables` | Physical dine-in tables | Stores table number, status, capacity, and QR metadata. |
| `menu_categories` | Menu grouping | Scoped by `restaurant_id` with ordering support. |
| `menu_items` | Sellable items | Should include price, availability, veg flags, and display order. |
| `promo_codes` | Discount definitions | Keep promo rules in a dedicated table instead of string arrays. |
| `orders` | Order header | Stores tenant, fulfillment type, source, totals, and operational status. |
| `order_items` | Order lines | Use relational line items for reporting; optional JSON snapshots can be stored for audit/history. |
| `payments` | Payment records | Keep payment state separate from order state. |
| `delivery_assignments` | Delivery ownership | Tracks which delivery agent is handling which order. |
| `table_sessions` | Dine-in session tracking | Helps with QR engagement, active session handling, and table analytics. |
| `audit_logs` | Operational accountability | Tracks important admin and staff changes. |
| `game_transactions` | Game-linked economics | Stores rewards, redemptions, or purchases linked to a restaurant and optional table. |

### 6.1 Data Standards

- Every tenant-owned entity should support filtering by `restaurant_id`.
- Use `created_at`, `updated_at`, and optionally `deleted_at` on operational tables.
- Add indexes on `restaurant_id`, `status`, and `created_at` for high-volume tables such as `orders`.
- Separate `order_status` from `payment_status`.
- Avoid storing core reporting structures only in `jsonb` if they need filtering, analytics, or reconciliation later.

## 7. Order and Payment Standards

Operational clarity depends on predictable states.

### 7.1 Fulfillment Types

- `dine_in`
- `delivery`
- `pickup`

### 7.2 Order Status

- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out_for_delivery`
- `completed`
- `cancelled`

### 7.3 Payment Status

- `unpaid`
- `pending`
- `paid`
- `failed`
- `refunded`
- `partially_refunded`

### 7.4 Order Source

- `public_qr`
- `table_qr`
- `direct_web`
- `dashboard`

Keeping these dimensions separate makes reporting, reconciliation, and debugging much cleaner.

## 8. Routing and Middleware Standards

The request-routing layer in `apps/customer-frontend`, `apps/restaurant-dashboard`, and `apps/delivery-portal` should:

1. Detect the `Host` header.
2. Resolve whether the request is for the public site or admin site.
3. Map the request to one tenant context.
4. Reject unknown or inactive tenant hosts safely.
5. Pass the resolved tenant context into downstream rendering and data fetching.

The backend must not trust frontend routing alone. Tenant validation should be repeated at the API and database boundary.

## 9. UI and UX Standards

The product should feel operationally clear, fast, and brand-consistent.

### 9.1 Customer Frontend

- Mobile-first design is the default.
- The public restaurant domain should immediately show the restaurant identity and a clear path into ordering.
- If the visit comes from a table QR, the table context should remain visible through the whole flow.
- Table ordering must remove address fields, delivery choices, and unnecessary checkout friction.
- Delivery ordering must keep address selection and tracking simple and obvious.

### 9.2 Restaurant Dashboard

- The dashboard should prioritize operational speed over decorative layouts.
- Orders should be easy to scan with strong visual badges for `delivery`, `pickup`, and `table`.
- Active queues, kitchen status, and delivery assignment should be visible without deep navigation.
- Empty, loading, and error states must be designed intentionally, not treated as afterthoughts.

### 9.3 Shared Design Standards

- Reuse shared components from `packages/ui` where possible.
- Keep spacing, typography, and status colors consistent across apps.
- Use UI states that make the tenant context clear to avoid staff mistakes across restaurants.
- Design interactions for touch-first use on customer screens and rapid keyboard/mouse use on dashboard screens.

## 10. Clean Code Standards

The codebase should stay easy to reason about as more restaurant features are added.

- Organize code by feature inside each app.
- Keep shared utilities in `packages/utils` and shared contracts in `packages/types`.
- Prefer small, focused components over large mixed-responsibility files.
- Move reusable state and workflow logic into hooks or service modules.
- Keep tenant resolution logic centralized instead of duplicating it across screens.
- Validate input at the API boundary before business logic runs.
- Use clear naming for fulfillment, payment, and role concepts so the meaning is obvious in code and UI.
- Separate server-only logic, client-only UI, and shared domain logic clearly in Next.js apps.
- Add tests for tenant resolution, QR flows, role access, and order state transitions.

## 11. Analytics and Reporting Standards

Analytics should support both restaurant operations and business reporting.

- Track `restaurant_id`, `fulfillment_type`, `source`, `table_id`, and `created_at` on all order analytics.
- Separate dine-in, delivery, and pickup revenue in reporting views.
- Keep game revenue and reward activity reportable by restaurant and, when relevant, by table.
- Track table sessions to measure dine-in engagement and QR usage quality.
- Audit high-impact operational actions so support and finance teams can investigate issues quickly.

---

This document is the current standard for the JustSearch platform. Keep the QR model simple, enforce tenant isolation everywhere, favor operationally clear UI, and prefer clean shared contracts over ad hoc feature logic.
