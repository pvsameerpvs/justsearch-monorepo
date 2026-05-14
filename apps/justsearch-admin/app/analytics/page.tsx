"use client";

import { Store, Users, Gamepad2, DollarSign, TrendingUp } from "lucide-react";
import { PageHeader } from "@justsearch/ui";

const PLATFORM_STATS = [
  { label: "Total Restaurants", value: "12", icon: Store, color: "bg-blue-100 text-blue-700" },
  { label: "Total Users", value: "2,847", icon: Users, color: "bg-amber-100 text-amber-700" },
  { label: "Game Plays", value: "15,432", icon: Gamepad2, color: "bg-purple-100 text-purple-700" },
  { label: "Total Revenue", value: "AED 45,000", icon: DollarSign, color: "bg-green-100 text-green-700" },
];

const MONTHLY_GROWTH = [
  { month: "Jan", restaurants: 8, users: 1200, revenue: 32000 },
  { month: "Feb", restaurants: 9, users: 1500, revenue: 35000 },
  { month: "Mar", restaurants: 10, users: 1800, revenue: 38000 },
  { month: "Apr", restaurants: 11, users: 2200, revenue: 41000 },
  { month: "May", restaurants: 12, users: 2847, revenue: 45000 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform-wide performance metrics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Monthly Growth</h3>
            <p className="text-sm text-slate-500">Platform expansion over time</p>
          </div>
        </div>

        <div className="space-y-4">
          {MONTHLY_GROWTH.map((m) => (
            <div key={m.month} className="flex items-center gap-4">
              <span className="w-10 text-sm font-bold text-slate-700">{m.month}</span>
              <div className="flex-1">
                <div className="flex h-8 items-center gap-2">
                  <div className="h-full rounded-md bg-blue-500 transition-all" style={{ width: `${(m.restaurants / 15) * 100}%` }} />
                  <span className="text-xs font-medium text-slate-600">{m.restaurants} restaurants</span>
                </div>
              </div>
              <span className="w-20 text-right text-xs font-bold text-slate-700">AED {m.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
