"use client";

import { useState, useMemo } from "react";
import { useOrderStore, type DashboardOrder, type OrderStatus } from "@/lib/stores/order-store";
import { useOrdersQuery, useUpdateOrderStatusMutation } from "@/lib/hooks/use-orders-query";
import { useDashboardAuth } from "@/lib/auth-context";
import { useOrderHistory } from "./use-order-history";
import { mapApiOrderToDashboard } from "./orders.utils";

type Tab = "active" | "history";

const ACTIVE_FILTERS = ["all", "pending", "confirmed", "preparing", "ready", "out_for_delivery"] as const;
const HISTORY_FILTERS = ["all", "completed", "cancelled"] as const;
const KITCHEN_FILTERS = ["all", "confirmed", "preparing", "ready"] as const;

function getTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function useOrderManager() {
  const { user } = useDashboardAuth();
  const isKitchen = user?.role === 'kitchen_staff';

  const updateStoreStatus = useOrderStore((s) => s.updateStatus);
  const { orders: apiOrders, isLoading, error, refetch } = useOrdersQuery();
  const { mutate: updateStatusApi } = useUpdateOrderStatusMutation();

  const [tab, setTab] = useState<Tab>("active");
  const [filter, setFilter] = useState("all");
  const [historyView, setHistoryView] = useState<"day" | "month" | "all">("day");
  const [historyDate, setHistoryDate] = useState<Date>(getTodayUtc);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [pendingOrderIds, setPendingOrderIds] = useState<Set<string>>(new Set());

  const orders = useMemo(() => apiOrders.map(mapApiOrderToDashboard), [apiOrders]);

  const isActiveTab = isKitchen ? true : tab === "active";
  const filters = isKitchen ? KITCHEN_FILTERS : (isActiveTab ? ACTIVE_FILTERS : HISTORY_FILTERS);

  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const filteredActive = activeOrders.filter((o) => (filter === "all" ? true : o.status === filter));

  const historyOrders = useOrderHistory(orders, historyView, historyDate);
  const filteredHistory = historyOrders.filter((o) => (filter === "all" ? true : o.status === filter));

  const kitchenOrders = activeOrders.filter((o) => ["confirmed", "preparing", "ready"].includes(o.status));
  const filteredKitchen = kitchenOrders.filter((o) => (filter === "all" ? true : o.status === filter));

  const visibleOrders = isKitchen ? filteredKitchen : (isActiveTab ? filteredActive : filteredHistory);
  const statsOrders = isKitchen ? kitchenOrders : (isActiveTab ? activeOrders : historyOrders);

  const updateStatus = (id: string, status: OrderStatus, cancelReason?: string) => {
    setPendingOrderIds((prev) => new Set(prev).add(id));
    updateStatusApi(
      { orderId: id, status, cancelReason },
      {
        onError: () => updateStoreStatus(id, status),
        onSettled: () => {
          setPendingOrderIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      }
    );
  };

  return {
    tab,
    setTab: isKitchen ? () => {} : setTab,
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
    pendingOrderIds,
    isActiveTab,
    filters,
    visibleOrders,
    statsOrders,
    isLoading,
    error,
    refetch,
  };
}
