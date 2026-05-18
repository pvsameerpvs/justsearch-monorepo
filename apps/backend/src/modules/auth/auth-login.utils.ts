import { findSuperAdmin, findPublicUser, findDeliveryAgent, findStaffMember } from './auth-login.services';
import type { TenantContext } from '../../middleware/tenant.middleware';

interface ResolvedUser {
  id: string;
  name: string;
  role: string;
  restaurantId?: string;
}

interface LoginResult {
  user: ResolvedUser | null;
  userType: 'staff' | 'delivery' | 'super_admin';
}

export async function resolveUser(
  username: string,
  password: string,
  type: string,
  tenant?: TenantContext
): Promise<LoginResult> {
  let user: ResolvedUser | null = null;
  let userType: 'staff' | 'delivery' | 'super_admin' = 'staff';

  if (type === 'super_admin') {
    user = await findSuperAdmin(username, password);
    userType = 'super_admin';
  } else if (type === 'delivery') {
    if (!tenant) throw new Error('Tenant context required');
    user = await findPublicUser(username, password, tenant.id);
    if (!user) {
      user = await findDeliveryAgent(tenant.schemaName, tenant.id, username, password);
    }
    userType = 'delivery';
  } else {
    if (!tenant) throw new Error('Tenant context required');
    user = await findPublicUser(username, password, tenant.id);
    if (!user) {
      user = await findStaffMember(tenant.schemaName, tenant.id, username, password);
    }
    userType = 'staff';
  }

  return { user, userType };
}
