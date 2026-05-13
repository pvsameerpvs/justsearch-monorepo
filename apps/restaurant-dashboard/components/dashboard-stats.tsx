"use client";

import { ShoppingBag, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Restaurant } from '@justsearch/utils';

interface Stat {
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
  icon: React.ElementType;
  accent: string;
  iconColor: string;
}

const STATS: Stat[] = [
  { label: "Today's Orders", value: '24', change: '+12%', changeUp: true, icon: ShoppingBag, accent: 'bg-amber-50', iconColor: 'text-amber-600' },
  { label: 'Revenue', value: 'AED 3,840', change: '+8%', changeUp: true, icon: DollarSign, accent: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { label: 'New Customers', value: '156', change: '+24%', changeUp: true, icon: Users, accent: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Avg Order Value', value: 'AED 160', change: '-3%', changeUp: false, icon: TrendingUp, accent: 'bg-violet-50', iconColor: 'text-violet-600' },
];

export function DashboardStats({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => {
        const Icon = s.icon;
        const TrendIcon = s.changeUp ? ArrowUpRight : ArrowDownRight;
        const trendColor = s.changeUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';

        return (
          <div key={s.label} className="elegant-card-hover p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.accent}`}>
                <Icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${trendColor}`}>
                <TrendIcon className="h-3 w-3" /> {s.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{s.value}</p>
            <p className="mt-0.5 text-sm text-slate-500">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
