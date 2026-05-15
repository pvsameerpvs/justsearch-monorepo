"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface ApiOrder {
  id: string;
  code: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: string;
  paymentMethod: string | null;
  createdAt: string;
}

export function useOrderStatusQuery(orderId: string) {
  const [data, setData] = useState<{ order: ApiOrder } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await apiClient<{ order: ApiOrder }>(`/orders/${orderId}`);
      setData(res);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  return { data, isLoading };
}
