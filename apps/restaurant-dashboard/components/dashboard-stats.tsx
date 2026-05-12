"use client";

import { ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

const STATS = [
  { label: "Today's Orders", value: '24', change: '+12%', icon: ShoppingBag, accent: 'bg-amber-50 text-amber-600' },
  { label: 'Revenue', value: 'AED 3,840', change: '+8%', icon: DollarSign, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Customers', value: '156', change: '+24%', icon: Users, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Avg Order', value: 'AED 160', change: '+5%', icon: TrendingUp, accent: 'bg-violet-50 text-violet-600' },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="elegant-card-hover p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                {s.change}
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
