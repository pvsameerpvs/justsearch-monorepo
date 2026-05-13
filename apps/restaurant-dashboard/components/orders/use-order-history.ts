"use client";

import { useMemo } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { isSameUtcDay, isSameUtcMonth } from "./time-utils";

export function useOrderHistory(view: "day" | "month" | "all", date: Date) {
  const { orders } = useOrderStore();

  return useMemo(() => {
    // ── Server-side filtering architecture ──
    // In production this becomes:
    //   useQuery({
    //     queryKey: ["orders", "history", view, date],
    //     queryFn: () => fetch(`/api/orders/history?status=completed,cancelled&view=${view}&date=${date.toISOString()}`),
    //   })
    //
    // For now we filter locally to simulate the server response.

    const historyOrders = orders.filter(
      (o) => o.status === "completed" || o.status === "cancelled"
    );

    if (view === "all") return historyOrders;

    return historyOrders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return view === "day"
        ? isSameUtcDay(orderDate, date)
        : isSameUtcMonth(orderDate, date);
    });
  }, [orders, view, date]);
}
