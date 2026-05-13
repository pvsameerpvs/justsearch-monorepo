import { useMemo, useState } from "react";
import type { DashboardOrder } from "@/lib/stores/order-store";
import { isSameUtcDay, isSameUtcMonth } from "@/components/orders/time-utils";

export type DriverDateFilter = "today" | "yesterday" | "week" | "month" | "all";

export function useDriverOrderFilter(orders: DashboardOrder[]) {
  const [filter, setFilter] = useState<DriverDateFilter>("all");

  const today = new Date(Date.UTC(2026, 4, 13));
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const weekStart = new Date(today);
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;

    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      switch (filter) {
        case "today":
          return isSameUtcDay(orderDate, today);
        case "yesterday":
          return isSameUtcDay(orderDate, yesterday);
        case "week":
          return orderDate >= weekStart && orderDate <= today;
        case "month":
          return isSameUtcMonth(orderDate, today);
        default:
          return true;
      }
    });
  }, [orders, filter, today, yesterday, weekStart]);

  const lifetimeStats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "completed");
    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue: completed.reduce((sum, o) => sum + o.total, 0),
      totalDeliveries: completed.length,
    };
  }, [orders]);

  const periodStats = useMemo(() => {
    const completed = filtered.filter((o) => o.status === "completed");
    return {
      totalOrders: filtered.length,
      completedOrders: completed.length,
      cancelledOrders: filtered.filter((o) => o.status === "cancelled").length,
      totalRevenue: completed.reduce((sum, o) => sum + o.total, 0),
    };
  }, [filtered]);

  return {
    filter,
    setFilter,
    filtered,
    lifetimeStats,
    periodStats,
  };
}
