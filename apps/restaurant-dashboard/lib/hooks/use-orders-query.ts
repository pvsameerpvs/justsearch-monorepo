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

export function useOrdersQuery() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{ orders: ApiOrder[] }>("/orders");
      setOrders(res.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return { orders, isLoading, error, refetch: fetchOrders };
}
