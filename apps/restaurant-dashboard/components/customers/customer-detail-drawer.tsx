"use client";

import { CustomerDetailHeader } from "./customer-detail-header";
import { CustomerDetailTabs } from "./customer-detail-tabs";
import { CustomerDetailOverview } from "./customer-detail-overview";
import { CustomerDetailOrders } from "./customer-detail-orders";
import { CustomerDetailGames } from "./customer-detail-games";
import { CustomerDetailVouchers } from "./customer-detail-vouchers";
import { CustomerOrderDetailModal } from "./customer-order-detail-modal";
import type { Customer } from "./types/customer.types";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  orders: DashboardOrder[];
  selectedOrder: DashboardOrder | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOrderClick: (orderId: string) => void;
  onClose: () => void;
  onCloseOrder: () => void;
}

export function CustomerDetailDrawer({
  customer,
  orders,
  selectedOrder,
  activeTab,
  onTabChange,
  onOrderClick,
  onClose,
  onCloseOrder,
}: CustomerDetailDrawerProps) {
  if (!customer) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto">
          <div className="p-5 space-y-4">
            <CustomerDetailHeader customer={customer} onClose={onClose} />
            <CustomerDetailTabs activeTab={activeTab} onTabChange={onTabChange} />

            {activeTab === "overview" && <CustomerDetailOverview customer={customer} />}
            {activeTab === "orders" && <CustomerDetailOrders orders={orders} onOrderClick={onOrderClick} />}
            {activeTab === "games" && <CustomerDetailGames games={customer.gameHistory} />}
            {activeTab === "vouchers" && <CustomerDetailVouchers vouchers={customer.voucherHistory} />}
          </div>
        </div>
      </div>

      <CustomerOrderDetailModal order={selectedOrder} onClose={onCloseOrder} />
    </>
  );
}
