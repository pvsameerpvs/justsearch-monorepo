# JustSearch Restaurant Activity Platform

A premium multi-tenant restaurant management and activity platform.

## 📱 Multi-Tenant Domain Structure

| Application | Domain |
| :--- | :--- |
| **Super Admin** | `mydomain.com` |
| **Customer Frontend** | `[restaurant].mydomain.com` |
| **Restaurant Dashboard** | `[restaurant]-admin.mydomain.com` |
| **Delivery Portal** | `[restaurant]-delivery.mydomain.com` |

## 🚀 Core Features

- **Multi-Tenant Routing**: Automatic resolution of restaurant context via subdomains.
- **QR Ecosystem**: 
    - One public restaurant delivery QR per tenant.
    - Table-specific QR codes for dine-in with POS integration.
- **Smart Fulfillment**: Context-aware ordering (Dine-in mode disables delivery options).
- **Advanced POS**: Centralized dashboard for orders, revenue, and analytics.
- **Dine-in Engagement**: Integrated games and loyalty rewards tracked per table.
- **Delivery Management**: Dedicated portal for delivery staff with real-time tracking.
- **Rich Product Control**: Veg/Both filters, categories, sub-categories, and flexible offer management (fixed/percentage).

## 🏗️ Monorepo Architecture

- `apps/customer-frontend`: Customer ordering & engagement.
- `apps/restaurant-dashboard`: Partner management & POS.
- `apps/delivery-portal`: Delivery-agent execution portal.
- `apps/justsearch-admin`: Super-admin platform control.
- `apps/backend`: Shared business logic & API.
- `packages/ui`: Shared premium UI component library.
- `packages/types`: Unified TypeScript definitions.

## 🛠️ Technical Implementation

Details on architecture and implementation patterns can be found in [agent.md](./agent.md).

## 📥 Installation & Setup

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
```

## 📜 Documentation

- `agent.md`: Reusable architecture strategy and implementation guide.
- `docs/customer-frontend-subdomain-ui.md`: Subdomain-based UI patterns.
- `docs/game-creation-agent.md`: Game creation playbook.
