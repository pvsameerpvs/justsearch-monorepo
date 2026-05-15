"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface ApiOrder {
  id: string;
  code: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: string;
  createdAt: string;
  fulfillmentType: string;
}

export function useDeliveryOrdersQuery() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await apiClient<{ orders: ApiOrder[] }>("/orders");
      setOrders(res.orders);
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return { orders, isLoading, refetch: fetchOrders };
}
