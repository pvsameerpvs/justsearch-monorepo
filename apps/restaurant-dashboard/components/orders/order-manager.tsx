"use client";

import { useState } from "react";
import { useOrderManager } from "./use-order-manager";
import { OrdersStats } from "./orders-stats";
import { OrderManagerTabs } from "./order-manager-tabs";
import { OrderManagerFilters } from "./order-manager-filters";
import { OrderManagerGrid } from "./order-manager-grid";
import { OrderDateFilter } from "./order-date-filter";
import { OrderSkeleton } from "./order-skeleton";
import { OrderError } from "./order-error";
import { OrderManagerModals } from "./order-manager-modals";
import { getNextStatus } from "./order-flow.utils";

export function OrderManager() {
  const {
    tab, setTab, filter, setFilter,
    historyView, setHistoryView, historyDate, setHistoryDate,
    assigningOrderId, setAssigningOrderId,
    viewingOrderId, setViewingOrderId,
    updateStatus,
    isActiveTab, filters, visibleOrders, statsOrders,
    isLoading, error, refetch,
  } = useOrderManager();

  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const rejectingOrder = rejectingOrderId ? visibleOrders.find((o) => o.id === rejectingOrderId) ?? null : null;

  const handleReject = (id: string) => setRejectingOrderId(id);
  const confirmReject = (reason: string) => {
    if (!rejectingOrderId) return;
    updateStatus(rejectingOrderId, "cancelled", reason);
    setRejectingOrderId(null);
  };

  return (
    <div className="space-y-5">
      <OrdersStats orders={statsOrders} activeFilter={filter} onFilterClick={setFilter} />

      {setTab !== (() => {}) && (
        <OrderManagerTabs tab={tab} onTabChange={(t) => { setTab(t); setFilter("all"); }} />
      )}

      {isActiveTab === false && setTab !== (() => {}) && (
        <OrderDateFilter date={historyDate} view={historyView} onDateChange={setHistoryDate} onViewChange={setHistoryView} />
      )}

      <OrderManagerFilters filters={filters} activeFilter={filter} onFilterChange={setFilter} />

      {isLoading && <OrderSkeleton />}
      {error && <OrderError message={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <OrderManagerGrid
          orders={visibleOrders}
          isActiveTab={isActiveTab}
          onAccept={(id) => updateStatus(id, "confirmed")}
          onReject={handleReject}
          onAdvance={(id, status, type) => {
            const next = getNextStatus(status, type);
            if (next) updateStatus(id, next);
          }}
          onAssign={setAssigningOrderId}
          onView={setViewingOrderId}
        />
      )}

      <OrderManagerModals
        assigningOrderId={assigningOrderId}
        viewingOrderId={viewingOrderId}
        rejectingOrder={rejectingOrder}
        onCloseAssign={() => setAssigningOrderId(null)}
        onCloseView={() => setViewingOrderId(null)}
        onAssignFromView={() => { setViewingOrderId(null); setAssigningOrderId(viewingOrderId); }}
        onRejectFromView={() => handleReject(viewingOrderId!)}
        onConfirmReject={confirmReject}
        onCloseReject={() => setRejectingOrderId(null)} />
    </div>
  );
}
