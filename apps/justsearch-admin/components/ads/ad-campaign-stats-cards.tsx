'use client';

import { useState, useEffect } from 'react';
import { Megaphone, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAdsQuery } from '@/lib/hooks/use-ads-query';

const STAT_META = [
  { label: 'Total Campaigns', key: 'total' as const, icon: Megaphone, gradient: 'from-indigo-500 to-violet-500', text: 'text-indigo-700', light: 'bg-indigo-50' },
  { label: 'Active', key: 'active' as const, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-700', light: 'bg-emerald-50' },
  { label: 'Impressions', key: 'impressions' as const, icon: Users, gradient: 'from-blue-500 to-sky-500', text: 'text-blue-700', light: 'bg-blue-50' },
  { label: 'Revenue', key: 'revenue' as const, icon: DollarSign, gradient: 'from-amber-500 to-orange-500', text: 'text-amber-700', light: 'bg-amber-50' },
];

export function AdCampaignStatsCards() {
  const [mounted, setMounted] = useState(false);
  const { ads: campaigns } = useAdsQuery();

  useEffect(() => setMounted(true), []);

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.isActive).length,
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STAT_META.map((s) => {
        const Icon = s.icon;
        const rawValue = s.key === 'impressions' ? stats.totalImpressions : s.key === 'revenue' ? stats.totalRevenue : stats[s.key];
        const value = s.key === 'revenue' ? `AED ${rawValue.toLocaleString()}` : rawValue.toLocaleString();

        return (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
            </div>
            <p className={`text-2xl font-black tracking-tight ${s.text}`}>{mounted ? value : <span className="text-slate-300">—</span>}</p>
          </div>
        );
      })}
    </div>
  );
}
