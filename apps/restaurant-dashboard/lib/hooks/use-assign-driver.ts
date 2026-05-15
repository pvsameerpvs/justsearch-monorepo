"use client";

import { apiClient } from '@/lib/api-client';

export function useAssignDriver() {
  const mutate = async ({ orderId, driverId }: { orderId: string; driverId: string }) => {
    await apiClient(`/orders/${orderId}/driver`, {
      method: 'PATCH',
      body: JSON.stringify({ driverId }),
    });
  };

  return { mutate };
}
