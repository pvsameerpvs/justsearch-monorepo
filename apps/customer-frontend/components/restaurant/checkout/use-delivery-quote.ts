"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { DeliveryQuoteResponse } from '@justsearch/types';

async function fetchDeliveryQuote(
  customerLat: number,
  customerLng: number
): Promise<DeliveryQuoteResponse> {
  return apiClient<DeliveryQuoteResponse>('/delivery/quote', {
    method: 'POST',
    body: JSON.stringify({ customerLat, customerLng }),
  });
}

export function useDeliveryQuote(
  enabled: boolean,
  customerLat?: number,
  customerLng?: number
) {
  return useQuery({
    queryKey: ['delivery-quote', customerLat, customerLng],
    queryFn: () => {
      if (customerLat == null || customerLng == null) {
        throw new Error('Coordinates required');
      }
      return fetchDeliveryQuote(customerLat, customerLng);
    },
    enabled: enabled && customerLat != null && customerLng != null,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
