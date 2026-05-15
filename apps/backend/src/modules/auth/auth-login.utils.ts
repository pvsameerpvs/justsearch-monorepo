import { findSuperAdmin, findDeliveryAgent, findStaffMember } from './auth-login.services';
import { MOCK_AUTH_ENABLED, findMockUser } from '../../lib/mock-auth';
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

  if (MOCK_AUTH_ENABLED) {
    const mockUser = findMockUser(username, password, type);
    if (mockUser) {
      user = {
        id: mockUser.id,
        name: mockUser.name,
        role: mockUser.role,
        restaurantId: mockUser.restaurantId,
      };
      userType = mockUser.type;
    }
    return { user, userType };
  }

  if (type === 'super_admin') {
    user = await findSuperAdmin(username, password);
    userType = 'super_admin';
  } else if (type === 'delivery') {
    if (!tenant) throw new Error('Tenant context required');
    user = await findDeliveryAgent(tenant.id, username, password);
    userType = 'delivery';
  } else {
    if (!tenant) throw new Error('Tenant context required');
    user = await findStaffMember(tenant.id, username, password);
    userType = 'staff';
  }

  return { user, userType };
}
