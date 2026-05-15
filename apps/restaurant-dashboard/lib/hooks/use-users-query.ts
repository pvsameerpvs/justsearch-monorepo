import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 30_000;

export interface User {
  id: string;
  restaurantId: string;
  email: string | null;
  phone: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

async function fetchUsers(): Promise<{ users: User[] }> {
  return apiClient('/users');
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: STALE_TIME,
  });
}
