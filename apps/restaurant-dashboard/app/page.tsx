"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/lib/auth-context";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";

export default function DashboardPage() {
  const { user } = useDashboardAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role && user.role !== 'owner') {
      router.replace('/orders');
    }
  }, [user, router]);

  return <DashboardContainer />;
}
