import { Request, Response, NextFunction } from 'express';
import { resolveSubdomain } from './tenant-resolver';
import { lookupTenant } from './tenant-lookup';
import { client } from '../db';

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
  _res: Response,
  next: NextFunction
) {
  const subdomain = resolveSubdomain(req);

  if (!subdomain) {
    await client.unsafe(`SET search_path TO ${PUBLIC_SCHEMAS}`);
    return next();
  }

  try {
    let tenant = getCachedTenant(subdomain);
    if (tenant === undefined) {
      tenant = await lookupTenant(subdomain);
      setCachedTenant(subdomain, tenant);
    }

    if (!tenant) {
      await client.unsafe(`SET search_path TO ${PUBLIC_SCHEMAS}`);
      _res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    if (tenant.status === 'suspended') {
      await client.unsafe(`SET search_path TO ${PUBLIC_SCHEMAS}`);
      _res.status(403).json({ error: 'Restaurant is suspended' });
      return;
    }

    const isAuthRoute = req.path?.includes('/auth/');
    if (!isAuthRoute && (tenant.status === 'inactive' || tenant.status === 'draft')) {
      await client.unsafe(`SET search_path TO ${PUBLIC_SCHEMAS}`);
      _res.status(403).json({ error: 'Restaurant is not active' });
      return;
    }

    req.tenant = tenant;
    await client.unsafe(`SET search_path TO "${tenant.schemaName}", ${PUBLIC_SCHEMAS}`);
    next();
  } catch (error) {
    await client.unsafe(`SET search_path TO ${PUBLIC_SCHEMAS}`);
    next(error);
  }
}
