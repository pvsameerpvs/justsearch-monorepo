import type { AnalyticsSummary } from '@/lib/hooks/use-analytics-query';
import { ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

export interface StatConfig {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
  iconColor: string;
}

export function buildStatConfigs(summary: AnalyticsSummary | null): StatConfig[] {
  if (!summary?.today || !summary?.allTime) return [];

  const today = summary.today;
  const allTime = summary.allTime;
  const totalCustomers = summary.totalCustomers ?? 0;
  const hasOrdersToday = (today.orders ?? 0) > 0;

  return [
    {
      label: "Today's Orders",
      value: String(hasOrdersToday ? today.orders : 0),
      sublabel: hasOrdersToday
        ? `${allTime.orders} all time`
        : `${allTime.orders} all time · place your first order`,
      icon: ShoppingBag,
      accent: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Revenue',
      value: `AED ${Math.round(hasOrdersToday ? today.revenue : 0).toLocaleString()}`,
      sublabel: `AED ${Math.round(allTime.revenue).toLocaleString()} all time`,
      icon: DollarSign,
      accent: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Customers',
      value: String(totalCustomers),
      sublabel: totalCustomers > 0 ? 'Registered visitors' : 'No customers yet',
      icon: Users,
      accent: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg Order Value',
      value: `AED ${Math.round(hasOrdersToday ? today.avgOrderValue : allTime.avgOrderValue).toLocaleString()}`,
      sublabel: hasOrdersToday
        ? `AED ${Math.round(allTime.avgOrderValue).toLocaleString()} all time`
        : 'All time average',
      icon: TrendingUp,
      accent: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];
}
