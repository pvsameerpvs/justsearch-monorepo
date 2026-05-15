"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface RecordPaymentVars {
  orderId: string;
  paymentMethod: 'cash' | 'card';
}

async function recordPayment({ orderId, paymentMethod }: RecordPaymentVars) {
  return apiClient(`/orders/${orderId}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentMethod, paymentStatus: 'paid' }),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordPayment,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['driverOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', vars.orderId] });
    },
  });
}
