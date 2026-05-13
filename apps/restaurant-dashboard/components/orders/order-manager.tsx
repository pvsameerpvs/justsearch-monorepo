"use client";

import { useOrderManager } from "./use-order-manager";
import { OrdersStats } from "./orders-stats";
import { OrderManagerTabs } from "./order-manager-tabs";
import { OrderManagerFilters } from "./order-manager-filters";
import { OrderManagerGrid } from "./order-manager-grid";
import { OrderDateFilter } from "./order-date-filter";
import { DeliveryBoyPicker } from "./delivery-boy-picker";
import { OrderDetailDrawer } from "./order-detail-drawer";

export function OrderManager() {
  const {
    tab, setTab, filter, setFilter,
    historyView, setHistoryView, historyDate, setHistoryDate,
    assigningOrderId, setAssigningOrderId,
    viewingOrderId, setViewingOrderId,
    updateStatus,
    isActiveTab, filters, visibleOrders, statsOrders,
  } = useOrderManager();

  return (
    <div className="space-y-5">
      <OrdersStats orders={statsOrders} />

      <OrderManagerTabs tab={tab} onTabChange={(t) => { setTab(t); setFilter("all"); }} />

      {!isActiveTab && (
        <OrderDateFilter
          date={historyDate}
          view={historyView}
          onDateChange={setHistoryDate}
          onViewChange={setHistoryView}
        />
      )}

      <OrderManagerFilters filters={filters} activeFilter={filter} onFilterChange={setFilter} />

      <OrderManagerGrid
        orders={visibleOrders}
        isActiveTab={isActiveTab}
        onAccept={(id) => updateStatus(id, "confirmed")}
        onAssign={setAssigningOrderId}
        onView={setViewingOrderId}
      />

      {assigningOrderId && (
        <DeliveryBoyPicker orderId={assigningOrderId} onClose={() => setAssigningOrderId(null)} />
      )}

      {viewingOrderId && (
        <OrderDetailDrawer
          orderId={viewingOrderId}
          onClose={() => setViewingOrderId(null)}
          onAssign={() => { setViewingOrderId(null); setAssigningOrderId(viewingOrderId); }}
        />
      )}
    </div>
  );
}
