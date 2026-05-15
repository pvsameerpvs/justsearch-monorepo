export interface TenantContext {
  id: string;
  slug: string;
  subdomain: string;
  schemaName: string;
  status: string;
}

export interface AuthContext {
  userId: string;
  role: string;
  restaurantId?: string;
  type: 'customer' | 'staff' | 'delivery' | 'super_admin';
}
