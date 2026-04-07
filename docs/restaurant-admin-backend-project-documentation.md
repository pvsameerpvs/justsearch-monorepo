# Restaurant Admin Backend Project Documentation
## JustSearch Restaurant Activity - Restaurant Dashboard Backend

This document describes the backend contract that powers the Restaurant Admin Dashboard for partner restaurants on the JustSearch Restaurant Activity platform.

Current implementation status:
- Shared Express + TypeScript backend scaffold
- Base routes: `/health` and `/api/v1`
- Middleware in place for CORS, Helmet, JSON parsing, cookie parsing, and centralized error handling

---

## 1. Overview

The Restaurant Admin Dashboard backend is the management layer used by restaurant owners, managers, and authorized staff to control restaurant-specific content and operations.

It is responsible for:
- Authenticating restaurant dashboard users
- Restricting access to one restaurant tenant at a time
- Serving dashboard data for branding, profile, menu, and social links
- Returning customer activity for that restaurant only
- Managing reward and redemption operations
- Emitting audit logs and notifications for important actions
- Keeping customer-facing frontend data in sync with dashboard updates

The backend must be the source of truth for all restaurant-specific records. The dashboard UI may present data, but the backend must enforce permissions and isolation.

---

## 2. Main Purpose

### 2.1 Restaurant content management
The backend enables restaurant teams to update the content displayed on the customer frontend, including branding, menu, descriptions, contact details, and social links.

### 2.2 Activity monitoring
The backend provides restaurant-scoped visibility into check-ins, game activity, reward claims, and redemption workflows.

### 2.3 Reward and redeem operations
The backend manages reward availability, claim records, redemption status, and approval or rejection flows.

### 2.4 Multi-layer platform support
The same backend should support:
- Customer Frontend
- Restaurant Admin Dashboard
- JustSearch Admin Dashboard

---

## 3. Platform Position

The platform is organized into three layers:

1. Customer Frontend
   - Public restaurant website
   - Menu, branding, login, games, rewards, and redeem flows

2. Restaurant Admin Dashboard
   - Restaurant-scoped management tool
   - Content updates, activity visibility, redeem handling, and QR management

3. JustSearch Admin Dashboard
   - Platform-wide support, oversight, and administrative controls

The Restaurant Admin Dashboard must never expose data from other restaurants unless explicitly authorized by a JustSearch admin workflow.

---

## 4. Domain Structure

Suggested domain separation:

- Customer Frontend: `restaurantname.justsearch-restaurantactivity.com`
- Restaurant Admin Dashboard: `restaurantname-admin.justsearch-restaurantactivity.com`
- Global Admin Dashboard: `admin.justsearch-restaurantactivity.com`

Recommended backend behavior:
1. Identify the tenant from the subdomain or host header.
2. Load the restaurant record for that tenant.
3. Scope all dashboard queries to that restaurant ID.
4. Reject requests when the restaurant cannot be resolved.

Optional future support:
- Custom domains for restaurant dashboards
- Tenant aliases
- Impersonation mode for support with a full audit trail

---

## 5. User Types

### 5.1 Restaurant Admin
Permissions:
- Manage profile, branding, menu, and social content
- View restaurant-specific customer activity
- Manage rewards and redemptions
- Access dashboard summary and QR tools

Limitations:
- Cannot view other restaurants
- Cannot manage platform-wide settings
- Cannot change JustSearch admin data

### 5.2 Restaurant Staff
Permissions:
- View basic customer activity
- Review or process redemptions when allowed
- Access limited operational pages

Limitations:
- Cannot modify branding or core settings unless explicitly granted
- Cannot access platform-wide data

### 5.3 JustSearch Admin
Permissions:
- Full platform access
- Can support or impersonate restaurant admins when needed
- Can inspect cross-tenant logs and system activity

---

## 6. Backend Functional Scope

### 6.1 Branding management
The backend should allow updates to:
- Logo
- Banner image
- Theme colors
- Accent colors
- Typography preference
- Brand message

### 6.2 Content management
The backend should allow updates to:
- Restaurant name
- Description
- Address
- Contact number
- Email
- Opening hours
- Social links
- Website or menu links

### 6.3 Activity visibility
The backend should expose restaurant-scoped:
- Check-ins
- Game plays
- Reward claims
- Redeem attempts
- Recent customer activity

### 6.4 Redemption operations
The backend should support:
- Redeem approval
- Redeem rejection
- Redeem status tracking
- Staff or admin approval notes

### 6.5 QR and check-in support
The backend should generate and serve:
- Restaurant QR code data
- QR download assets
- Check-in stats
- Session validation metadata

---

## 7. Core Backend Flows

### 7.1 Login flow
1. Restaurant staff opens the admin dashboard.
2. User enters credentials or OTP.
3. Backend authenticates the user.
4. Backend verifies the user belongs to one restaurant tenant.
5. Backend creates an authenticated session.
6. Dashboard pages become available.

### 7.2 Dashboard load flow
1. Authenticated user opens the dashboard home page.
2. Backend loads restaurant-scoped summary data.
3. Backend returns counts for check-ins, activity, rewards, and pending redemptions.
4. Dashboard renders KPIs and quick actions.

### 7.3 Branding update flow
1. Restaurant admin edits branding data.
2. Backend validates the submitted content and files.
3. Backend stores the updated restaurant branding.
4. Customer frontend immediately reflects the new branding on the next fetch.

### 7.4 Menu update flow
1. Restaurant admin uploads or edits menu content.
2. Backend validates file type, size, and structure.
3. Backend stores the new menu record or asset.
4. Customer frontend receives the latest menu data.

### 7.5 Redeem approval flow
1. A customer submits a redeem request.
2. Restaurant staff or admin opens the redeem queue.
3. Backend returns pending redemptions for that restaurant only.
4. Staff approves or rejects the request.
5. Backend updates the reward wallet and redemption history.

---

## 8. Access Control and Tenant Isolation

Each restaurant may only access its own data.

Required rules:
- Every restaurant-scoped query must include `restaurant_id`
- A restaurant admin cannot access another restaurant's customers, menu, rewards, or logs
- Staff permissions must be narrower than admin permissions
- JustSearch admin access must be explicit and auditable

Suggested authorization checks:
- Role-based access control
- Restaurant-scoped ownership validation
- Route-level permission guards
- Action-level audit logging

---

## 9. Authentication and Session Model

### 9.1 Recommended auth style
Because this is a browser-based dashboard, cookie-based authentication is the most practical default.

Recommended properties:
- HTTP-only
- Secure
- SameSite configured for the deployment model
- Domain-scoped when sharing auth across dashboard subdomains

### 9.2 Optional login methods
- Email and password
- Phone and password
- Email OTP
- Phone OTP

### 9.3 Session behavior
The backend should:
- Issue authenticated sessions after login
- Return the current dashboard user profile
- Support logout and session revocation
- Expire inactive sessions according to policy

---

## 10. Suggested API Surface

All routes should live under a versioned API prefix such as `/api/v1`.

### 10.1 Authentication APIs
- `POST /api/v1/restaurant-admin/login`
- `POST /api/v1/restaurant-admin/logout`
- `GET /api/v1/restaurant-admin/me`
- `POST /api/v1/restaurant-admin/password/change`
- `POST /api/v1/restaurant-admin/otp/send`
- `POST /api/v1/restaurant-admin/otp/verify`

### 10.2 Dashboard summary APIs
- `GET /api/v1/restaurant-admin/dashboard/summary`
- `GET /api/v1/restaurant-admin/dashboard/activity`
- `GET /api/v1/restaurant-admin/dashboard/redeems`

### 10.3 Profile APIs
- `GET /api/v1/restaurant-admin/profile`
- `PUT /api/v1/restaurant-admin/profile`

### 10.4 Branding APIs
- `GET /api/v1/restaurant-admin/branding`
- `PUT /api/v1/restaurant-admin/branding`

### 10.5 Menu APIs
- `GET /api/v1/restaurant-admin/menu`
- `PUT /api/v1/restaurant-admin/menu`
- `POST /api/v1/restaurant-admin/menu/upload`
- `DELETE /api/v1/restaurant-admin/menu/assets/:id`

### 10.6 Social link APIs
- `GET /api/v1/restaurant-admin/social-links`
- `PUT /api/v1/restaurant-admin/social-links`

### 10.7 Customer activity APIs
- `GET /api/v1/restaurant-admin/activity`
- `GET /api/v1/restaurant-admin/checkins`
- `GET /api/v1/restaurant-admin/games`
- `GET /api/v1/restaurant-admin/rewards/claims`

### 10.8 Reward and redeem APIs
- `GET /api/v1/restaurant-admin/rewards`
- `POST /api/v1/restaurant-admin/rewards`
- `PUT /api/v1/restaurant-admin/rewards/:id`
- `GET /api/v1/restaurant-admin/redeems`
- `POST /api/v1/restaurant-admin/redeems/:id/approve`
- `POST /api/v1/restaurant-admin/redeems/:id/reject`

### 10.9 QR APIs
- `GET /api/v1/restaurant-admin/qr`
- `GET /api/v1/restaurant-admin/qr/download`
- `GET /api/v1/restaurant-admin/qr/stats`

### 10.10 Settings and staff APIs
- `GET /api/v1/restaurant-admin/settings`
- `PUT /api/v1/restaurant-admin/settings`
- `GET /api/v1/restaurant-admin/staff`
- `POST /api/v1/restaurant-admin/staff`
- `PUT /api/v1/restaurant-admin/staff/:id`
- `DELETE /api/v1/restaurant-admin/staff/:id`

### 10.11 Notification APIs
- `GET /api/v1/restaurant-admin/notifications`
- `POST /api/v1/restaurant-admin/notifications/:id/read`

---

## 11. Data Model

The backend should persist restaurant dashboard data in PostgreSQL or an equivalent relational store.

### 11.1 Restaurant
Core tenant record.
- `id`
- `name`
- `slug`
- `subdomain`
- `status`
- `created_at`
- `updated_at`

### 11.2 Restaurant profile
Public-facing business details.
- `restaurant_id`
- `description`
- `address`
- `phone`
- `email`
- `website_url`
- `opening_hours`

### 11.3 Restaurant branding
Visual identity data.
- `restaurant_id`
- `logo_url`
- `banner_url`
- `primary_color`
- `accent_color`
- `theme_mode`
- `font_family`

### 11.4 Menu
Menu metadata and presentation.
- `id`
- `restaurant_id`
- `title`
- `type`
- `status`
- `asset_url`
- `created_at`
- `updated_at`

### 11.5 Social links
Restaurant social media data.
- `restaurant_id`
- `platform`
- `url`
- `is_active`

### 11.6 Dashboard user
Restaurant admin or staff account.
- `id`
- `restaurant_id`
- `name`
- `email`
- `phone`
- `role`
- `status`
- `created_at`
- `updated_at`

### 11.7 Customer activity
Restaurant-scoped interaction records.
- `id`
- `restaurant_id`
- `customer_id`
- `activity_type`
- `metadata`
- `created_at`

### 11.8 Check-in record
Used for QR and visit analytics.
- `id`
- `restaurant_id`
- `customer_id`
- `session_id`
- `checked_in_at`
- `expired_at`

### 11.9 Reward
Restaurant-specific or global reward record.
- `id`
- `restaurant_id`
- `scope`
- `title`
- `description`
- `reward_type`
- `status`
- `points_cost`
- `created_at`

### 11.10 Redemption
Reward approval workflow record.
- `id`
- `restaurant_id`
- `customer_id`
- `reward_id`
- `status`
- `approved_by`
- `approved_at`
- `rejection_reason`
- `created_at`

### 11.11 QR asset
Restaurant QR data and generated assets.
- `id`
- `restaurant_id`
- `asset_url`
- `download_url`
- `version`
- `created_at`

### 11.12 Audit log
Important change history.
- `id`
- `restaurant_id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

### 11.13 Notification
Dashboard notifications.
- `id`
- `restaurant_id`
- `recipient_user_id`
- `type`
- `title`
- `message`
- `is_read`
- `created_at`

---

## 12. Standard Response Contract

The backend should return a consistent JSON shape so the dashboard can handle success and failure states predictably.

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
- `RESTAURANT_NOT_FOUND`
- `AUTH_REQUIRED`
- `PERMISSION_DENIED`
- `SESSION_EXPIRED`
- `VALIDATION_FAILED`
- `UPLOAD_INVALID`
- `REDEEM_NOT_FOUND`
- `REDEEM_ALREADY_RESOLVED`

---

## 13. Security Requirements

The backend must protect the dashboard against cross-tenant access and unsafe uploads.

### 13.1 Required protections
- Restaurant-scoped authorization checks
- Staff role restrictions
- JustSearch admin impersonation audit trail
- Rate limiting on login and file upload endpoints
- File upload validation for type, size, and content
- Audit logging for profile, menu, branding, reward, and redemption changes

### 13.2 Optional protections
- MFA for admins
- IP allowlist for staff in high-security deployments
- Device/session fingerprinting
- Suspicious login alerts

### 13.3 Upload safety
The backend should validate:
- Image file types
- PDF menu file types
- Maximum file size
- Content metadata
- Storage location and access permissions

---

## 14. Notification Requirements

The backend should notify restaurant dashboard users about:
- New pending redemptions
- Approved or rejected redemptions
- Successful profile or branding updates
- Failed file uploads
- Important account changes

Notification delivery can be:
- In-app notifications
- Email notifications
- Future push notifications

---

## 15. Reporting and Analytics

### 15.1 MVP reporting
The dashboard should receive:
- Total check-ins today
- Active customers today
- Recent activity
- Pending redemptions
- Reward usage summary

### 15.2 Future analytics
Possible extended reporting:
- Weekly trends
- Popular rewards
- Peak check-in times
- Customer segmentation
- Redemption conversion rates

---

## 16. UX and Operational Expectations

The backend should support a dashboard experience that is:
- Simple for restaurant managers
- Mobile responsive on tablets and phones
- Fast to load for daily operational use
- Clear about the restaurant scope of every action

The backend should also provide helpful empty states and error messages so the dashboard can explain what happened.

---

## 17. Suggested Backend Folder Structure

```text
src/
  app.ts
  server.ts
  config/
  middleware/
  modules/
    restaurant-admin/
      auth/
      dashboard/
      profile/
      branding/
      menu/
      social-links/
      activity/
      rewards/
      redeems/
      qr/
      settings/
      notifications/
      staff/
      audit/
  lib/
  types/
  utils/
  validations/
```

Suggested module responsibilities:
- `auth`: dashboard login, logout, session handling
- `dashboard`: summaries, KPIs, and top-level widgets
- `profile`: restaurant business profile management
- `branding`: logo, color, and theme management
- `menu`: menu uploads and menu metadata
- `social-links`: social and contact links
- `activity`: check-ins, games, customer events
- `rewards`: reward definitions and monitoring
- `redeems`: redemption workflow and approval actions
- `qr`: QR generation, download, and stats
- `settings`: account preferences and password changes
- `notifications`: unread and read state
- `staff`: dashboard user management
- `audit`: immutable change history

---

## 18. Minimum MVP Scope

For the first backend version, the minimum scope should include:
- Login and logout
- Dashboard overview summary
- Restaurant profile management
- Branding management
- Menu upload or menu management
- Social links management
- Customer activity view
- Reward and redeem history
- QR code display or download
- Basic staff settings
- Audit logging for critical changes

---

## 19. Future Enhancements

Possible backend extensions:
- Team permissions and approval workflows
- Advanced analytics dashboards
- Weekly and monthly exports
- Multi-location restaurant support
- Menu scheduling by time of day
- Promotion campaigns
- Automated reward rules
- Support chat or ticket integration

---

## 20. Final Functional Summary

The Restaurant Admin Dashboard backend is the restaurant-scoped control layer for the JustSearch platform.

It should:
- Keep restaurant data isolated
- Let restaurants manage their own public-facing content
- Track customer activity for that restaurant only
- Support redeem approval and reward monitoring
- Push updates to the customer frontend through shared backend data

Important rule:
- Restaurant A must never see Restaurant B's data, and every dashboard action must be validated against the authenticated restaurant tenant.

---

## 21. One-Line Product Definition

The Restaurant Admin Backend is a restaurant-scoped management API that lets authorized staff control content, monitor activity, and process rewards for their own restaurant only.
