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

export function useDriverOrdersQuery(driverId?: string | null) {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!driverId) return;
    try {
      const res = await apiClient<{ orders: ApiOrder[] }>(`/orders?driverId=${driverId}`);
      setOrders(res.orders);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [driverId]);

  return { orders, isLoading, refetch: fetchOrders };
}
