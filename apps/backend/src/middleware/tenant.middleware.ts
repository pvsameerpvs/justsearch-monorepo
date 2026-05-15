import { Request, Response, NextFunction } from 'express';
import { MOCK_AUTH_ENABLED, MOCK_RESTAURANT } from '../lib/mock-auth';
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

export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const subdomain = resolveSubdomain(req);

  if (!subdomain) {
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
    return next();
  }

  try {
    const tenant = await lookupTenant(subdomain);

    if (!tenant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (tenant.status === 'suspended') {
      return res.status(403).json({ error: 'Restaurant is suspended' });
    }

    if (tenant.status === 'inactive' || tenant.status === 'draft') {
      return res.status(403).json({ error: 'Restaurant is not active' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
}
