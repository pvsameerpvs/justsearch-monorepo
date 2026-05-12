"use client";

import { Store, DollarSign, Users, TrendingUp } from 'lucide-react';

const STATS = [
  {
    label: 'Restaurants',
    value: '12',
    change: '+3 this month',
    icon: Store,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Monthly Revenue (AED)',
    value: '45,000',
    change: '+18% vs last month',
    icon: DollarSign,
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Total Users',
    value: '2,847',
    change: '+12% vs last month',
    icon: Users,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Game Plays',
    value: '15,432',
    change: '+34% vs last month',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-700',
  },
];

export function AdminStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-xs text-green-600">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
