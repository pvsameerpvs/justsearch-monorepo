"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface UpdateStatusVars {
  orderId: string;
  status: string;
}

async function updateDeliveryStatus({ orderId, status }: UpdateStatusVars) {
  return apiClient(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeliveryStatus,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['driverOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', vars.orderId] });
    },
  });
}
