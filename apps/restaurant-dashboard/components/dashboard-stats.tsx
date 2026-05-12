"use client";

import { ShoppingBag, DollarSign, Users, TrendingUp, Star } from 'lucide-react';
import type { Restaurant } from '@justsearch/utils';

export function DashboardStats({ restaurant }: { restaurant: Restaurant }) {
  const stats = [
    { label: "Today's Orders", value: '24', change: '+12%', icon: ShoppingBag, accent: 'bg-amber-50 text-amber-600' },
    { label: 'Revenue', value: 'AED 3,840', change: '+8%', icon: DollarSign, accent: 'bg-emerald-50 text-emerald-600' },
    { label: 'Customers', value: '156', change: '+24%', icon: Users, accent: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Order', value: 'AED 160', change: '+5%', icon: TrendingUp, accent: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
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

      <div className="elegant-card p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-900">{restaurant.overallRating}</span>
            <span className="text-slate-400">({restaurant.totalReviews} reviews)</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Cuisine: </span>
            <span className="font-medium text-slate-700">{restaurant.cuisine.join(', ')}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">City: </span>
            <span className="font-medium text-slate-700">{restaurant.city}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Category: </span>
            <span className="font-medium text-slate-700">{restaurant.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
