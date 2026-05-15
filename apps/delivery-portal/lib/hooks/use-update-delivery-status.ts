"use client";

import { apiClient } from '@/lib/api-client';

export function useUpdateDeliveryStatus() {
  const mutate = async ({ orderId, status }: { orderId: string; status: string }) => {
    await apiClient(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  };

  return { mutate };
}
