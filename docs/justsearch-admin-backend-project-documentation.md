# JustSearch Admin Backend Project Documentation
## JustSearch Restaurant Activity - Super Admin Dashboard

This document describes the backend contract that powers the JustSearch Admin Dashboard, the central control panel for the entire JustSearch Restaurant Activity platform.

Current implementation status:
- Shared Express + TypeScript backend scaffold
- Base routes: `/health` and `/api/v1`
- Middleware in place for CORS, Helmet, JSON parsing, cookie parsing, and centralized error handling

---

## 1. Overview

The JustSearch Admin Dashboard is the highest-level operational interface in the platform.

It is used by the JustSearch internal team to:
- Create and manage restaurants
- Assign and maintain subdomains
- Manage platform users and moderation
- Create global and restaurant-specific rewards
- Monitor activity and usage across the whole platform
- Control system-wide settings and operational rules

The backend must act as the source of truth for all platform-wide data and must enforce role-based access, tenant isolation, and auditability.

---

## 2. Main Purpose

### 2.1 Platform control
The backend should provide centralized control over the multi-restaurant ecosystem and support safe, reliable platform operations.

### 2.2 Restaurant onboarding
The backend should support restaurant creation, configuration, subdomain assignment, activation, and deactivation.

### 2.3 Reward system management
The backend should manage global rewards and restaurant-specific rewards, including rules, validity, and scope.

### 2.4 Monitoring and analytics
The backend should provide platform-wide visibility into restaurants, users, check-ins, game usage, reward activity, and redemptions.

---

## 3. Platform Role

The platform has three layers:

1. Customer Frontend
   - Public restaurant experience

2. Restaurant Admin Dashboard
   - Restaurant-scoped content and operations management

3. JustSearch Admin Dashboard
   - Platform-wide control, oversight, and support

The JustSearch Admin Dashboard has the broadest permissions, but every action should still be logged and traceable.

---

## 4. Domain Structure

Suggested domains:

- Customer Frontend: `restaurantname.justsearch-restaurantactivity.com`
- Restaurant Admin Dashboard: `restaurantname-admin.justsearch-restaurantactivity.com`
- JustSearch Admin Dashboard: `admin.justsearch-restaurantactivity.com`

Recommended backend behavior:
1. Identify whether the request is for a platform admin route or a restaurant-scoped route.
2. Enforce auth and role checks before returning any admin data.
3. Resolve restaurant-specific requests to the correct tenant.
4. Return `403` for unauthorized cross-scope access.

Optional future support:
- Custom admin domains
- Subdomain aliasing
- Support impersonation with a full audit trail

---

## 5. User Type

### 5.1 JustSearch Admin
Full system access with the ability to manage every part of the platform.

Capabilities:
- Create and manage restaurants
- Assign unique subdomains
- Manage all users
- Block and unblock users
- Create and manage global and restaurant-specific rewards
- View all restaurants, users, rewards, redemptions, and activity logs
- Control global system settings

Limitations:
- Must still respect role boundaries and audit requirements
- Impersonation or elevated support actions should be explicitly logged

---

## 6. Backend Functional Scope

### 6.1 Restaurant management
The backend should support:
- Create restaurant records
- Edit restaurant profile data
- Delete or archive restaurants
- Activate or deactivate restaurants
- Assign and validate subdomains

### 6.2 User management
The backend should support:
- View all platform users
- Inspect login history and activity
- View points balances and basic account state
- Block or unblock users

### 6.3 Reward management
The backend should support:
- Create and edit rewards
- Configure global and restaurant-specific scope
- Set points required
- Set validity windows
- Track reward lifecycle state

### 6.4 Redemption management
The backend should support:
- View all redemptions across the platform
- Filter by restaurant, user, reward, or status
- Approve, complete, reject, or expire redemptions

### 6.5 Activity monitoring
The backend should expose platform-wide:
- Check-ins
- Game plays
- Reward claims
- Redemption status changes
- High-level usage metrics

### 6.6 Global settings
The backend should support system-wide configuration for:
- Session timing
- Token expiry
- Game play limits
- Optional platform-wide policies

---

## 7. Core Backend Flows

### 7.1 Admin login flow
1. JustSearch admin opens the dashboard.
2. Admin enters credentials or approved authentication factors.
3. Backend validates the account and role.
4. Backend creates an authenticated session.
5. Admin gains access to platform-wide tools.

### 7.2 Restaurant onboarding flow
1. Admin creates a restaurant record.
2. Backend validates required fields and subdomain uniqueness.
3. Backend stores restaurant profile and status.
4. Backend links the restaurant to its public frontend and dashboard tenants.

### 7.3 Reward creation flow
1. Admin creates a reward.
2. Backend validates reward type, points, scope, and validity.
3. Backend stores the reward as global or restaurant-specific.
4. Reward becomes available to the relevant frontend and dashboard workflows.

### 7.4 Monitoring flow
1. Admin opens the dashboard overview or reports page.
2. Backend aggregates platform-wide counts and trends.
3. Backend returns KPIs and activity summaries.
4. Admin reviews platform health and operational patterns.

---

## 8. Access Rules and Isolation

The JustSearch Admin Dashboard has platform-wide access, but it should still use strict authorization rules.

Required rules:
- Only authenticated JustSearch admins can access admin routes
- Restaurant dashboard users cannot access platform admin routes
- Customer users cannot access admin routes
- All cross-tenant actions must be logged

Recommended authorization checks:
- Role-based access control
- Route-level guards
- Permission flags for sensitive operations
- Audit logging for impersonation and destructive actions

---

## 9. Authentication and Session Model

### 9.1 Recommended auth style
Cookie-based authentication is recommended for browser dashboards.

Recommended properties:
- HTTP-only
- Secure
- SameSite configured for the deployment model
- Domain-scoped for the admin subdomain when appropriate

### 9.2 Optional login methods
- Email and password
- Email OTP
- MFA for privileged accounts

### 9.3 Session behavior
The backend should:
- Issue and verify authenticated admin sessions
- Return the current admin identity and permissions
- Support logout and session revocation
- Expire inactive sessions according to policy

---

## 10. Suggested API Surface

All routes should live under a versioned prefix such as `/api/v1`.

### 10.1 Authentication APIs
- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/auth/me`

### 10.2 Dashboard APIs
- `GET /api/v1/admin/dashboard/summary`
- `GET /api/v1/admin/dashboard/activity`
- `GET /api/v1/admin/dashboard/analytics`

### 10.3 Restaurant APIs
- `POST /api/v1/admin/restaurants`
- `GET /api/v1/admin/restaurants`
- `GET /api/v1/admin/restaurants/:id`
- `PUT /api/v1/admin/restaurants/:id`
- `DELETE /api/v1/admin/restaurants/:id`
- `PATCH /api/v1/admin/restaurants/:id/status`

### 10.4 Subdomain APIs
- `GET /api/v1/admin/subdomains/check`
- `POST /api/v1/admin/restaurants/:id/subdomain`

### 10.5 User APIs
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:id`
- `PATCH /api/v1/admin/users/:id/block`
- `PATCH /api/v1/admin/users/:id/unblock`
- `GET /api/v1/admin/users/:id/activity`

### 10.6 Reward APIs
- `POST /api/v1/admin/rewards`
- `GET /api/v1/admin/rewards`
- `GET /api/v1/admin/rewards/:id`
- `PUT /api/v1/admin/rewards/:id`
- `PATCH /api/v1/admin/rewards/:id/status`

### 10.7 Redemption APIs
- `GET /api/v1/admin/redemptions`
- `GET /api/v1/admin/redemptions/:id`
- `PATCH /api/v1/admin/redemptions/:id/approve`
- `PATCH /api/v1/admin/redemptions/:id/complete`
- `PATCH /api/v1/admin/redemptions/:id/reject`

### 10.8 Activity and logs APIs
- `GET /api/v1/admin/activity-logs`
- `GET /api/v1/admin/activity-logs/export`
- `GET /api/v1/admin/platform-metrics`

### 10.9 Settings APIs
- `GET /api/v1/admin/settings`
- `PUT /api/v1/admin/settings`

### 10.10 Notification APIs
- `GET /api/v1/admin/notifications`
- `POST /api/v1/admin/notifications/:id/read`

---

## 11. Data Model

The backend should persist the following platform-wide entities in PostgreSQL or an equivalent relational database.

### 11.1 Restaurant
Platform tenant record.
- `id`
- `name`
- `slug`
- `subdomain`
- `status`
- `contact_email`
- `contact_phone`
- `created_at`
- `updated_at`

### 11.2 User
Platform user record.
- `id`
- `name`
- `email`
- `phone`
- `role`
- `status`
- `restaurant_id`
- `created_at`
- `updated_at`

### 11.3 Reward
Global or restaurant-specific reward record.
- `id`
- `scope`
- `restaurant_id`
- `name`
- `type`
- `points_required`
- `valid_from`
- `valid_to`
- `status`
- `created_at`

### 11.4 Redemption
Reward redemption record.
- `id`
- `user_id`
- `reward_id`
- `restaurant_id`
- `status`
- `processed_by`
- `processed_at`
- `created_at`

### 11.5 Activity log
Immutable audit and activity record.
- `id`
- `actor_type`
- `actor_id`
- `restaurant_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

### 11.6 System setting
Global configuration value.
- `id`
- `key`
- `value`
- `description`
- `updated_by`
- `updated_at`

### 11.7 Subdomain mapping
Unique subdomain ownership record.
- `id`
- `restaurant_id`
- `subdomain`
- `is_primary`
- `created_at`

### 11.8 Admin session
Authenticated admin session record.
- `id`
- `admin_user_id`
- `expires_at`
- `last_activity_at`
- `created_at`

---

## 12. Standard Response Contract

The backend should return a consistent JSON shape for all admin endpoints.

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
  "message": "Access denied",
  "code": "AUTH_REQUIRED"
}
```

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
- `AUTH_REQUIRED`
- `PERMISSION_DENIED`
- `RESTAURANT_NOT_FOUND`
- `SUBDOMAIN_TAKEN`
- `USER_NOT_FOUND`
- `REWARD_NOT_FOUND`
- `REDEMPTION_NOT_FOUND`
- `SETTING_INVALID`
- `VALIDATION_FAILED`

---

## 13. Security Requirements

The backend must protect the super admin surface with strict controls.

### 13.1 Required protections
- Strong authentication for JustSearch admins
- Role-based access control
- Route-level authorization
- Subdomain uniqueness validation
- Audit logging for every destructive or sensitive change
- Rate limiting on login and sensitive mutation endpoints

### 13.2 Optional protections
- MFA for all super admin accounts
- IP allowlisting
- Device trust checks
- Suspicious action alerts

### 13.3 Data isolation
Even though the admin dashboard has platform-wide access, the backend should still isolate restaurant data logically and record every cross-tenant action.

---

## 14. Notifications and Alerts

The backend should support internal notifications for:
- New restaurant created
- Restaurant activated or suspended
- Subdomain changes
- User blocked or unblocked
- New or updated reward created
- Large volume redemption activity
- System setting changes

Delivery options:
- In-app notifications
- Email alerts
- Future webhook or Slack integrations

---

## 15. Reporting and Analytics

### 15.1 MVP reporting
The admin dashboard should receive:
- Total restaurants
- Total users
- Total scans
- Total rewards redeemed
- Recent activity

### 15.2 Future analytics
Possible extensions:
- Growth trends
- Restaurant performance comparisons
- Reward conversion rates
- Abuse detection metrics
- Regional or time-based usage breakdowns

---

## 16. Suggested Backend Folder Structure

```text
src/
  app.ts
  server.ts
  config/
  middleware/
  modules/
    admin/
      auth/
      dashboard/
      restaurants/
      users/
      rewards/
      redemptions/
      activity/
      settings/
      notifications/
      analytics/
      audit/
      subdomains/
  lib/
  types/
  utils/
  validations/
```

Suggested module responsibilities:
- `auth`: login, logout, and session management
- `dashboard`: platform-wide KPIs and summary cards
- `restaurants`: restaurant lifecycle and status
- `users`: user listing, blocking, and activity review
- `rewards`: reward creation and management
- `redemptions`: redemption workflow and resolution
- `activity`: logs and behavior monitoring
- `settings`: global system configuration
- `notifications`: internal alerts and read state
- `analytics`: metrics and trends
- `audit`: immutable action history
- `subdomains`: subdomain validation and mapping

---

## 17. Minimum MVP Scope

For the first version of the JustSearch Admin Dashboard, the backend should include:
- Admin login and logout
- Dashboard overview
- Restaurant creation and management
- Subdomain assignment
- User list and blocking
- Reward creation and management
- Redemptions list and update actions
- Basic analytics and reporting
- System settings
- Audit logging for critical actions

---

## 18. Future Features

Possible backend enhancements:
- Advanced analytics
- Campaign management
- Multi-branch restaurant support
- Automated reward rules
- Fraud and abuse detection
- Exportable reports
- Support impersonation workflow

---

## 19. Final Functional Summary

The JustSearch Admin Dashboard backend is the master control system for the entire platform.

It should:
- Manage all restaurants, users, rewards, and settings
- Keep all operations auditable and secure
- Enforce subdomain uniqueness and tenant integrity
- Provide platform-wide reporting and operational visibility

Important rule:
- Restaurants must never gain access to platform admin routes, and every super admin action must be validated, logged, and attributable.

---

## 20. One-Line Product Definition

The JustSearch Admin Backend is the centralized control API for managing all restaurants, users, rewards, redemptions, and platform settings across the JustSearch Restaurant Activity ecosystem.
