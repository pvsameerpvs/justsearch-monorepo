"use client";

import { useDashboardData } from "@/components/dashboard/hooks/use-dashboard-data";
import { DashboardPresenter } from "./dashboard-presenter";

export function DashboardContainer() {
  const data = useDashboardData();

  return <DashboardPresenter {...data} />;
}
