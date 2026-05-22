"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface AssignDriverVars {
  orderId: string;
  driverId: string;
}

async function assignDriver({ orderId, driverId }: AssignDriverVars) {
  return apiClient(`/orders/${orderId}/driver`, {
    method: 'PATCH',
    body: JSON.stringify({ driverId }),
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-agents'] });
    },
  });
}
