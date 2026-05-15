import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 60_000;

interface AnalyticsSummary {
  today: {
    orders: number;
    completed: number;
    revenue: number;
    avgOrderValue: number;
  };
  totalCustomers: number;
}

interface TrendDay {
  date: string;
  orders: number;
  revenue: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

async function fetchSummary(): Promise<AnalyticsSummary> {
  return apiClient('/analytics/summary');
}

async function fetchTrend(days?: number): Promise<{ trend: TrendDay[] }> {
  return apiClient(`/analytics/orders${days ? `?days=${days}` : ''}`);
}

async function fetchTopItems(): Promise<{ topItems: TopItem[] }> {
  return apiClient('/analytics/top-items');
}

export function useAnalyticsSummaryQuery() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchSummary,
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsTrendQuery(days?: number) {
  return useQuery({
    queryKey: ['analytics', 'trend', days],
    queryFn: () => fetchTrend(days),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsTopItemsQuery() {
  return useQuery({
    queryKey: ['analytics', 'top-items'],
    queryFn: fetchTopItems,
    staleTime: STALE_TIME,
  });
}
