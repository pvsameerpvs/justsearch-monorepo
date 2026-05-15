'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  restaurantId?: string;
}

const USERS_KEY = ['admin-users'] as const;

async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await apiClient<{ users: AdminUser[] }>('/admin/users');
  return res.users;
}

export function useUsersAdminQuery() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: USERS_KEY,
    queryFn: fetchAdminUsers,
  });
  return { users, isLoading, error };
}
