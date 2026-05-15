"use client";

import { useState } from "react";
import { useOrderStore, type DashboardOrder, type OrderStatus } from "@/lib/stores/order-store";
import { useOrdersQuery, useUpdateOrderStatusMutation } from "@/lib/hooks/use-orders-query";
import { useOrderSound } from "./use-order-sound";
import { useOrderHistory } from "./use-order-history";
import { mapApiOrderToDashboard } from "./orders.utils";

type Tab = "active" | "history";

const ACTIVE_FILTERS = ["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery"] as const;
const HISTORY_FILTERS = ["all", "completed", "cancelled"] as const;

const DEFAULT_HISTORY_DATE = new Date(Date.UTC(2026, 4, 13));

export function useOrderManager() {
  const updateStoreStatus = useOrderStore((s) => s.updateStatus);
  const { orders: apiOrders, isLoading: apiLoading, error: apiError, refetch } = useOrdersQuery();
  const { mutate: updateStatusApi } = useUpdateOrderStatusMutation();
  const [tab, setTab] = useState<Tab>("active");
  const [filter, setFilter] = useState<string>("all");
  const [historyView, setHistoryView] = useState<"day" | "month" | "all">("day");
  const [historyDate, setHistoryDate] = useState<Date>(DEFAULT_HISTORY_DATE);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  const orders = apiOrders.map(mapApiOrderToDashboard);

  useOrderSound(orders);

  const isActiveTab = tab === "active";
  const filters = isActiveTab ? ACTIVE_FILTERS : HISTORY_FILTERS;

  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const filteredActive = activeOrders.filter((o) => (filter === "all" ? true : o.status === filter));

  const historyOrders = useOrderHistory(historyView, historyDate);
  const filteredHistory = historyOrders.filter((o) => (filter === "all" ? true : o.status === filter));

  const visibleOrders: DashboardOrder[] = isActiveTab ? filteredActive : filteredHistory;
  const statsOrders = isActiveTab ? activeOrders : historyOrders;

  const updateStatus = (id: string, status: OrderStatus) => {
    updateStatusApi(
      { orderId: id, status },
      {
        onError: () => updateStoreStatus(id, status),
      }
    );
  };

  return {
    tab,
    setTab,
    filter,
    setFilter,
    historyView,
    setHistoryView,
    historyDate,
    setHistoryDate,
    assigningOrderId,
    setAssigningOrderId,
    viewingOrderId,
    setViewingOrderId,
    updateStatus,
    isActiveTab,
    filters,
    visibleOrders,
    statsOrders,
    isLoading: apiLoading,
    error: apiError,
    refetch,
  };
}
