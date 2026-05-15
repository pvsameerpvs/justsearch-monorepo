import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { restaurants } from '../db/schema/restaurants';
import { eq } from 'drizzle-orm';
import { MOCK_AUTH_ENABLED, MOCK_RESTAURANT } from '../lib/mock-auth';

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
  const host =
    (req.headers['x-forwarded-host'] as string) ||
    req.headers.host ||
    '';

  const baseDomain =
    process.env.NEXT_PUBLIC_BASE_DOMAIN || 'mydomain.com';

  let subdomain = '';
  const normalizedHost = host.toLowerCase().replace(/:\d+$/, '');

  if (normalizedHost.endsWith(`.${baseDomain}`)) {
    subdomain = normalizedHost.replace(`.${baseDomain}`, '').split('.').pop() || '';
  } else if (normalizedHost.endsWith('.localhost')) {
    subdomain = normalizedHost.replace('.localhost', '').split('.').pop() || '';
  }

  // Fallback: explicit restaurant slug from frontend custom header
  const slugHeader = (req.headers['x-restaurant-slug'] as string)?.trim().toLowerCase();
  if (slugHeader && !subdomain) {
    subdomain = slugHeader;
  }

  if (!subdomain || normalizedHost === baseDomain) {
    // Allow localhost / direct API calls to resolve tenant via explicit header
    const slugHeader = (req.headers['x-restaurant-slug'] as string)?.trim().toLowerCase();
    if (slugHeader) {
      subdomain = slugHeader;
    } else {
      return next();
    }
  }

  // Strip portal suffixes for admin and delivery subdomains
  if (subdomain.endsWith('-admin')) {
    subdomain = subdomain.slice(0, -6);
  } else if (subdomain.endsWith('-delivery')) {
    subdomain = subdomain.slice(0, -9);
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
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.subdomain, subdomain))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (restaurant.status === 'suspended') {
      return res.status(403).json({ error: 'Restaurant is suspended' });
    }

    if (restaurant.status === 'inactive' || restaurant.status === 'draft') {
      return res.status(403).json({ error: 'Restaurant is not active' });
    }

    req.tenant = {
      id: restaurant.id,
      slug: restaurant.slug,
      subdomain: restaurant.subdomain,
      schemaName: restaurant.schemaName,
      status: restaurant.status,
    };

    next();
  } catch (error) {
    next(error);
  }
}
