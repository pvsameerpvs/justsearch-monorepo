"use client";

import { useState, useMemo, useCallback } from "react";
import { useCustomerStore, computeCustomerStats } from "@/lib/stores/customer-store";
import { useOrderStore } from "@/lib/stores/order-store";
import type { Customer } from "../types/customer.types";

export function useCustomerManager() {
  const { customers } = useCustomerStore();
  const { orders } = useOrderStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const stats = useMemo(() => computeCustomerStats(customers), [customers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }, [customers, search]);

  const selectedCustomer = useMemo(
    () => (selectedId ? customers.find((c) => c.id === selectedId) ?? null : null),
    [selectedId, customers]
  );

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customerPhone === selectedCustomer.phone ||
        o.customerName === selectedCustomer.name
    );
  }, [selectedCustomer, orders]);

  const selectedOrder = useMemo(
    () => (selectedOrderId ? orders.find((o) => o.id === selectedOrderId) ?? null : null),
    [selectedOrderId, orders]
  );

  const onClose = useCallback(() => {
    setSelectedId(null);
    setSelectedOrderId(null);
    setActiveTab("overview");
  }, []);

  const onCloseOrder = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  return {
    customers: filtered,
    stats,
    search,
    setSearch,
    selectedId,
    setSelectedId,
    selectedCustomer,
    customerOrders,
    selectedOrder,
    selectedOrderId,
    setSelectedOrderId,
    activeTab,
    setActiveTab,
    onClose,
    onCloseOrder,
  };
}
