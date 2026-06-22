"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export type ActivePromo = {
  id: string;
  code: string;
  title: string | null;
  type: 'fixed' | 'percentage';
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  validUntil: string | null;
};

export function useActivePromos() {
  return useQuery({
    queryKey: ['vouchers', 'active'],
    queryFn: async () => {
      const response = await apiClient<{ vouchers: ActivePromo[] }>('/vouchers/active');
      return response.vouchers ?? [];
    },
    staleTime: 60_000,
    retry: 1,
  });
}
