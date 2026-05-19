'use client';

import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { BarChart3, Eye, MousePointer, CheckCircle, XCircle, DollarSign, TrendingUp } from "lucide-react";

interface AdAnalyticsProps {
  adId: string;
}

interface AnalyticsData {
  id: string;
  name: string;
  budget: number;
  spent: number;
  totalViews3s: number;
  totalViewsFull: number;
  totalClicks: number;
  totalConfirmedClicks: number;
  totalAbandonedClicks: number;
  revenueJustsearch: number;
  revenueRestaurant: number;
  ctr: number;
  confirmationRate: number;
}

async function fetchAdAnalytics(adId: string): Promise<AnalyticsData> {
  const res = await apiClient<{ analytics: AnalyticsData }>(`/advertisements/${adId}/analytics`);
  return res.analytics;
}

export function AdAnalyticsDetail({ adId }: AdAnalyticsProps) {
  const [showEvents, setShowEvents] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['ad-analytics', adId],
    queryFn: () => fetchAdAnalytics(adId),
  });

  if (isLoading) return <div className="p-6 text-sm text-slate-500">Loading analytics...</div>;
  if (!data) return <div className="p-6 text-sm text-red-500">Failed to load analytics</div>;

  const totalRevenue = data.revenueJustsearch + data.revenueRestaurant;
  const budgetUsed = data.budget > 0 ? Math.round((data.spent / data.budget) * 100) : 0;

  const statCards = [
    { label: '3s Views', value: data.totalViews3s, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', cost: data.totalViews3s * 0.30 },
    { label: 'Full Views', value: data.totalViewsFull, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', cost: data.totalViewsFull * 1.00 },
    { label: 'Clicks', value: data.totalConfirmedClicks, icon: MousePointer, color: 'text-indigo-600', bg: 'bg-indigo-50', cost: data.totalConfirmedClicks * 5.00 },
    { label: 'Accidental', value: data.totalAbandonedClicks, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', cost: 0 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{data.name}</h3>
          <p className="text-xs text-slate-500">Ad Analytics Breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700">Budget: AED {data.budget.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Used: {budgetUsed}%</p>
        </div>
      </div>

      {/* Revenue Split */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold uppercase text-slate-500">JustSearch Revenue</span>
          </div>
          <p className="text-2xl font-black text-amber-600">AED {data.revenueJustsearch.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase text-slate-500">Restaurant Revenue</span>
          </div>
          <p className="text-2xl font-black text-emerald-600">AED {data.revenueRestaurant.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-xl border border-slate-200 ${s.bg} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-[10px] font-bold uppercase text-slate-500">{s.label}</span>
              </div>
              <p className={`text-xl font-black ${s.color}`}>{s.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">AED {s.cost.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Rates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase text-slate-500">Click-Through Rate</span>
          </div>
          <p className="text-2xl font-black text-indigo-600">{data.ctr.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Clicks ÷ Full Views</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase text-slate-500">Click Confirmation</span>
          </div>
          <p className="text-2xl font-black text-emerald-600">{data.confirmationRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Real clicks ÷ Total clicks</p>
        </div>
      </div>

      {/* Total */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Total Revenue</p>
            <p className="text-3xl font-black text-amber-700">AED {totalRevenue.toLocaleString()}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-amber-400" />
        </div>
      </div>
    </div>
  );
}
