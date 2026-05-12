"use client";

import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';

const STATS = [
  {
    label: 'Today\'s Orders',
    value: '24',
    change: '+12%',
    icon: ShoppingBag,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Revenue (AED)',
    value: '3,840',
    change: '+8%',
    icon: DollarSign,
    color: 'bg-green-100 text-green-700',
  },
  {
    label: 'Active Customers',
    value: '156',
    change: '+24%',
    icon: Users,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Avg. Order Value',
    value: '160',
    change: '+5%',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-700',
  },
];

export function DashboardStats() {
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
              <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
