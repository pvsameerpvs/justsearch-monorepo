import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 30_000;

export interface StaffMember {
  id: string;
  restaurantId: string;
  name: string;
  username: string;
  role: string;
  permissions: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

async function fetchStaff(): Promise<{ staff: StaffMember[] }> {
  return apiClient('/staff');
}

export function useStaffQuery() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
    staleTime: STALE_TIME,
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient('/staff', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/staff/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
