"use client";

import { useMemo } from "react";
import { isSameUtcDay, isSameUtcMonth } from "./time-utils";
import type { DashboardOrder } from "@/lib/stores/order-store";

export function useOrderHistory(orders: DashboardOrder[], view: "day" | "month" | "all", date: Date) {
  return useMemo(() => {
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
