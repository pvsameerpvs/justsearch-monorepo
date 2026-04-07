# JustSearch Restaurant Activity Platform

A multi-restaurant platform foundation with a shared backend and specialized frontend apps.

## Monorepo Architecture

- `apps/customer-frontend`: Next.js app for customers.
- `apps/restaurant-dashboard`: Next.js app for restaurant partners.
- `apps/justsearch-admin`: Next.js app for super admins.
- `apps/backend`: Shared Node.js REST API.
- `packages/ui`: Shared Tailwind-based UI component library.
- `packages/config`: Shared ESLint, TSConfig, and Tailwind presets.
- `packages/types`: Shared TypeScript definitions.
- `packages/utils`: Shared helper utilities.

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo.
- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend**: Node.js, Express, TypeScript, Zod.
- **Database**: Supabase (PostgreSQL).
- **Storage**: Supabase Storage.

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Also copy .env.example to apps/*/ folders if needed
```

## Run Locally

```bash
# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build
```

## Structure Notes

- All business logic lives in `apps/backend`.
- UI components are shared via `@justsearch/ui`.
- Type safety is ensured across the stack using `@justsearch/types`.

## Documentation

- `docs/customer-backend-project-documentation.md`: backend contract and implementation guide for the customer-facing restaurant experience.
- `docs/restaurant-admin-backend-project-documentation.md`: backend contract and implementation guide for the restaurant admin dashboard experience.
- `docs/justsearch-admin-backend-project-documentation.md`: backend contract and implementation guide for the super admin dashboard experience.
