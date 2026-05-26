"use client";

import { buildStatConfigs } from './dashboard/build-stat-configs';
import { StatCard } from './dashboard/stat-card';
import type { AnalyticsSummary } from '@/lib/hooks/use-analytics-query';

export function DashboardStats({ summary }: { summary: AnalyticsSummary | null }) {
  const stats = buildStatConfigs(summary);

  if (stats.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}
