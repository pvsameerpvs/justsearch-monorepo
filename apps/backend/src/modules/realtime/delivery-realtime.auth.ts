import type { IncomingMessage } from 'http';
import { lookupTenant } from '../../middleware/tenant-lookup';
import { verifyAccessToken } from '../../utils/jwt';

export interface DeliverySocketContext {
  driverId: string;
  schemaName: string;
}

function getSocketUrl(req: IncomingMessage): URL {
  const host = req.headers.host || 'localhost';
  return new URL(req.url || '/', `http://${host}`);
}

function isTenantActive(status: string): boolean {
  return status !== 'suspended' && status !== 'inactive' && status !== 'draft';
}

export async function authenticateDeliverySocket(
  req: IncomingMessage
): Promise<DeliverySocketContext | null> {
  const url = getSocketUrl(req);
  const token = url.searchParams.get('token');
  const restaurantSlug = url.searchParams.get('restaurantSlug');

  if (!token || !restaurantSlug) return null;

  const auth = verifyAccessToken(token);
  if (auth.type !== 'delivery' || auth.role !== 'driver') return null;

  const tenant = await lookupTenant(restaurantSlug);
  if (!tenant || !isTenantActive(tenant.status)) return null;
  if (auth.restaurantId !== tenant.id) return null;

  return {
    driverId: auth.id,
    schemaName: tenant.schemaName,
  };
}
