import { Request, Response, NextFunction } from 'express';
import { MOCK_AUTH_ENABLED, MOCK_RESTAURANT } from '../lib/mock-auth';
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

  if (MOCK_AUTH_ENABLED) {
    req.tenant = {
      id: MOCK_RESTAURANT.id,
      slug: MOCK_RESTAURANT.slug,
      subdomain: MOCK_RESTAURANT.subdomain,
      schemaName: MOCK_RESTAURANT.schemaName,
      status: MOCK_RESTAURANT.status,
    };
    await client.unsafe(`SET search_path TO "${MOCK_RESTAURANT.schemaName}", ${PUBLIC_SCHEMAS}`);
    return next();
  }

  try {
    const tenant = await lookupTenant(subdomain);

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

    if (tenant.status === 'inactive' || tenant.status === 'draft') {
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
