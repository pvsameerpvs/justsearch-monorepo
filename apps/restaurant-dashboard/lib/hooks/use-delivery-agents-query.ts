import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 30_000;

export interface DeliveryAgent {
  id: string;
  restaurantId: string;
  userId: string | null;
  name: string;
  phone: string;
  username: string;
  vehicleType: string;
  status: string;
  rating: string;
  completedToday: number;
  isActive: boolean;
  createdAt: string;
}

async function fetchAgents(): Promise<{ agents: DeliveryAgent[] }> {
  return apiClient('/delivery-agents');
}

export function useDeliveryAgentsQuery() {
  return useQuery({
    queryKey: ['delivery-agents'],
    queryFn: fetchAgents,
    staleTime: STALE_TIME,
  });
}

export function useCreateDeliveryAgentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient('/delivery-agents', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-agents'] });
    },
  });
}

export function useUpdateDeliveryAgentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient(`/delivery-agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-agents'] });
    },
  });
}

export function useDeleteDeliveryAgentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/delivery-agents/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-agents'] });
    },
  });
}
