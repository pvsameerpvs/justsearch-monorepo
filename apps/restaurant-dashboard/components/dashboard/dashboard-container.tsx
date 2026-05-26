"use client";

import { PageHeader } from "@justsearch/ui";
import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import { WelcomeBar } from "./welcome-bar";
import { QuickActions } from "./quick-actions";
import { StatsContainer } from "./stats-container";
import { RecentOrdersContainer } from "./recent-orders-container";
import { TopMenuItemsContainer } from "./top-menu-items-container";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardError } from "./dashboard-error";

export function DashboardContainer() {
  const { restaurant, isLoading, error } = useRestaurantProfile();

  if (isLoading) return <DashboardSkeleton />;

  if (error || !restaurant) {
    return (
      <DashboardError
        message={error?.message || "Failed to load restaurant profile"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeBar restaurant={restaurant} />
      <PageHeader title="Dashboard" description={`Overview of ${restaurant.name} today`} />
      <QuickActions />
      <StatsContainer />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrdersContainer />
        <TopMenuItemsContainer />
      </div>
    </div>
  );
}
