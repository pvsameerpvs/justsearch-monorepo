# Eatygo Website Railway Deployment

This app deploys as a shared pnpm monorepo service.

## Railway Service Settings

- Service source: repository root
- Config file: `/apps/eatygo-website/railway.json`
- Root directory: leave unset unless Railway auto-imports the pnpm workspace
- Healthcheck path: `/`

The build and start commands are defined in `railway.json`:

```bash
pnpm --filter eatygo-website build
pnpm --filter eatygo-website start
```

## Domains

Attach the public Eatygo marketing domain to this service:

- `eatygo.com`
- `www.eatygo.com`

Use a generated Railway domain first if you want to smoke-test before DNS changes.

## Local Verification

```bash
pnpm --filter eatygo-website typecheck
pnpm --filter eatygo-website build
PORT=3006 pnpm --filter eatygo-website start
```

No app-specific environment variables are currently required.
