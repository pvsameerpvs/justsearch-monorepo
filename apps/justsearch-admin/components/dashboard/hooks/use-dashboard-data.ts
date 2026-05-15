import { useMemo } from 'react';

import { useRestaurantsQuery } from '@/lib/hooks/use-restaurants-query';
import { useUsersAdminQuery } from '@/lib/hooks/use-users-admin-query';
import { useRevenueAdminQuery } from '@/lib/hooks/use-revenue-admin-query';
import { useAdsQuery } from '@/lib/hooks/use-ads-query';
import { useGamesQuery } from '@/lib/hooks/use-games-query';
import { useAnalyticsAdminQuery } from '@/lib/hooks/use-analytics-admin-query';

import type { DashboardData } from '@/components/dashboard/types/dashboard-types';

export function useDashboardData(): DashboardData {
  const { restaurants } = useRestaurantsQuery();
  const { users } = useUsersAdminQuery();
  const { summary: revenue, restaurants: revenueRestaurants } = useRevenueAdminQuery();
  const { ads: campaigns } = useAdsQuery();
  const { games } = useGamesQuery();
  const { analytics } = useAnalyticsAdminQuery();

  const stats = useMemo(
    () => ({
      restaurants: restaurants.length,
      activeRestaurants: restaurants.filter((r) => r.status === 'active').length,
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      totalRevenue: revenue?.totalRevenue ?? 0,
      totalOrders: revenue?.totalOrders ?? 0,
      totalViews: revenue?.totalViews ?? 0,
      activeCampaigns: campaigns.filter((c) => c.isActive).length,
      totalCampaigns: campaigns.length,
      totalImpressions: 0,
      activeGames: games.filter((g) => g.isActive).length,
      totalGames: games.length,
      totalPoints: 0,
    }),
    [restaurants, users, revenue, campaigns, games],
  );

  const topRestaurants = useMemo(
    () =>
      [...revenueRestaurants]
        .sort((a, b) => b.adRevenue + b.subscriptionRevenue - (a.adRevenue + a.subscriptionRevenue))
        .slice(0, 4),
    [revenueRestaurants],
  );

  const activeCampaigns = useMemo(
    () => campaigns.filter((c) => c.isActive).slice(0, 4),
    [campaigns],
  );

  const recentUsers = useMemo(() => users.slice(0, 5).map((u) => ({
    id: u.id,
    restaurantId: u.restaurantId ?? '',
    name: u.name,
    phone: u.phone ?? '',
    status: u.isActive ? 'active' as const : 'inactive' as const,
    totalPoints: 0,
    gamePoints: [],
  })), [users]);

  return { stats, monthlyData: analytics?.monthlyData ?? [], topRestaurants, activeCampaigns, recentUsers };
}
