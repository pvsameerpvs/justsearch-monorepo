import { Request, Response, NextFunction } from 'express';
import { resolveSubdomain } from './tenant-resolver';
import { lookupTenant } from './tenant-lookup';

export interface TenantContext {
  id: string;
  slug: string;
  subdomain: string;
  schemaName: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

const PUBLIC_SCHEMAS = 'public';

// Simple in-memory LRU cache for tenant lookups (dev/prod)
const tenantCache = new Map<string, { tenant: TenantContext | null; expiry: number }>();
const TENANT_CACHE_TTL_MS = 30_000;

function getCachedTenant(subdomain: string): TenantContext | null | undefined {
  const cached = tenantCache.get(subdomain);
  if (!cached) return undefined;
  if (Date.now() > cached.expiry) {
    tenantCache.delete(subdomain);
    return undefined;
  }
  return cached.tenant;
}

function setCachedTenant(subdomain: string, tenant: TenantContext | null) {
  tenantCache.set(subdomain, { tenant, expiry: Date.now() + TENANT_CACHE_TTL_MS });
}

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const subdomain = resolveSubdomain(req);

  if (!subdomain) {
    return next();
  }

  try {
    let tenant = getCachedTenant(subdomain);
    if (tenant === undefined) {
      tenant = await lookupTenant(subdomain);
      setCachedTenant(subdomain, tenant);
    }

    if (!tenant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    if (tenant.status === 'suspended') {
      res.status(403).json({ message: 'Restaurant is suspended' });
      return;
    }

    const isAuthRoute = req.path?.includes('/auth/');
    if (!isAuthRoute && (tenant.status === 'inactive' || tenant.status === 'draft')) {
      res.status(403).json({ message: 'Restaurant is not active' });
      return;
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
}
