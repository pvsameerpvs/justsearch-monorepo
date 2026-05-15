"use client";

import { useUsersQuery } from "@/lib/hooks/use-users-query";
import { CustomerManager } from "@/components/customers";
import { CustomerSkeleton } from "@/components/customers/customer-skeleton";
import { CustomerError } from "@/components/customers/customer-error";

export default function CustomersPage() {
  const { data, isLoading, error, refetch } = useUsersQuery();

  if (isLoading) return <CustomerSkeleton />;
  if (error) return <CustomerError error={error} onRetry={refetch} />;

  return <CustomerManager users={data?.users ?? []} />;
}
