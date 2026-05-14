"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_CUSTOMERS } from "./customer-store-data";
import type { Customer, CustomerStats } from "@/components/customers/types/customer.types";

interface CustomerStore {
  customers: Customer[];
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    () => ({ customers: INITIAL_CUSTOMERS }),
    { name: "customer-store" }
  )
);

export function computeCustomerStats(customers: Customer[]): CustomerStats {
  const thisMonth = new Date().toISOString().slice(0, 7);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  return {
    total: customers.length,
    newThisMonth: customers.filter((c) => c.registeredAt.startsWith(thisMonth)).length,
    activeThisWeek: customers.filter((c) => c.lastVisit >= weekAgo).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };
}
