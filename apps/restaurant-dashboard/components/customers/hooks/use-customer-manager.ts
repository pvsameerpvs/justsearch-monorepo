"use client";

import { useState, useMemo, useCallback } from "react";
import { useOrderStore, type DashboardOrder } from "@/lib/stores/order-store";
import type { User } from "@/lib/hooks/use-users-query";
import type { Customer, CustomerStats } from "../types/customer.types";
import { computeCustomerStats } from "@/lib/stores/customer-store";

function mapUserToCustomer(user: User, orders: DashboardOrder[]): Customer {
  const userOrders = orders.filter((o) => o.customerPhone === user.phone || o.customerName === user.name);
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const lastOrder = [...userOrders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
  return {
    id: user.id, name: user.name, phone: user.phone, email: user.email || "-",
    birthday: "-", location: "-", totalOrders, totalSpent, vipTier: "Bronze",
    points: 0, lastVisit: lastOrder ? lastOrder.createdAt.slice(0, 10) : "-",
    registeredAt: user.createdAt.slice(0, 10), addresses: [], gameHistory: [], voucherHistory: [],
  };
}

export function useCustomerManager(users: User[]) {
  const { orders } = useOrderStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const allCustomers = useMemo(() => users.map((u) => mapUserToCustomer(u, orders)), [users, orders]);
  const stats = useMemo(() => computeCustomerStats(allCustomers), [allCustomers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.phone.includes(term) || u.email?.toLowerCase().includes(term));
  }, [users, search]);

  const selectedCustomer = useMemo(() => {
    const user = selectedId ? users.find((u) => u.id === selectedId) : null;
    return user ? mapUserToCustomer(user, orders) : null;
  }, [selectedId, users, orders]);

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerPhone === selectedCustomer.phone || o.customerName === selectedCustomer.name);
  }, [selectedCustomer, orders]);

  const selectedOrder = useMemo(() => (selectedOrderId ? orders.find((o) => o.id === selectedOrderId) ?? null : null), [selectedOrderId, orders]);

  const onClose = useCallback(() => {
    setSelectedId(null);
    setSelectedOrderId(null);
    setActiveTab("overview");
  }, []);

  const onCloseOrder = useCallback(() => setSelectedOrderId(null), []);

  return {
    filteredUsers, stats, search, setSearch, selectedId, setSelectedId,
    selectedCustomer, customerOrders, selectedOrder, selectedOrderId,
    setSelectedOrderId, activeTab, setActiveTab, onClose, onCloseOrder, allOrders: orders,
  };
}
