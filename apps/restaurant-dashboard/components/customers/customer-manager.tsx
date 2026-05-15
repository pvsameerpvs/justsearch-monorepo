"use client";

import { PageHeader } from "@justsearch/ui";
import { useCustomerManager } from "./hooks/use-customer-manager";
import { CustomerStatsCards } from "./customer-stats-cards";
import { CustomerTableHeader } from "./customer-table-header";
import { CustomerTable, CustomerEmpty } from "./customer-table";
import { CustomerDetailDrawer } from "./customer-detail-drawer";
import type { User } from "@/lib/hooks/use-users-query";

interface CustomerManagerProps {
  users: User[];
}

export function CustomerManager({ users }: CustomerManagerProps) {
  const {
    filteredUsers, stats, search, setSearch, selectedCustomer,
    customerOrders, selectedOrder, setSelectedOrderId, activeTab,
    setActiveTab, setSelectedId, onClose, onCloseOrder, allOrders,
  } = useCustomerManager(users);

  return (
    <div className="space-y-5">
      <PageHeader title="Customers" description="View customer profiles, addresses, orders, games, and vouchers" />
      <CustomerStatsCards stats={stats} />
      <CustomerTableHeader search={search} onSearchChange={setSearch} total={filteredUsers.length} />
      {filteredUsers.length === 0 ? (
        <CustomerEmpty />
      ) : (
        <CustomerTable users={filteredUsers} orders={allOrders} onSelect={setSelectedId} />
      )}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        orders={customerOrders}
        selectedOrder={selectedOrder}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOrderClick={setSelectedOrderId}
        onClose={onClose}
        onCloseOrder={onCloseOrder}
      />
    </div>
  );
}
