import type { StatConfig } from './build-stat-configs';

export function StatCard({ stat }: { stat: StatConfig }) {
  const Icon = stat.icon;
  return (
    <div className="elegant-card-hover p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent}`}>
          <Icon className={`h-5 w-5 ${stat.iconColor}`} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
      <p className="mt-1 text-[11px] font-medium text-slate-400">{stat.sublabel}</p>
    </div>
  );
}
