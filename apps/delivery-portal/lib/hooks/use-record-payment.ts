"use client";

import { apiClient } from '@/lib/api-client';

export function useRecordPayment() {
  const mutate = async ({ orderId, paymentMethod }: { orderId: string; paymentMethod: 'cash' | 'card' }) => {
    await apiClient(`/orders/${orderId}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethod, paymentStatus: 'paid' }),
    });
  };

  return { mutate };
}
