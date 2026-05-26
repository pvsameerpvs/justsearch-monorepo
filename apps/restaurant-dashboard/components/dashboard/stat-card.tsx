import type { StatConfig } from './build-stat-configs';

const ACCENT_GRADIENTS: Record<string, { from: string; to: string; shadow: string; bg: string }> = {
  'bg-amber-50': { from: 'from-amber-400', to: 'to-orange-500', shadow: 'shadow-amber-500/20', bg: 'bg-amber-50/60' },
  'bg-emerald-50': { from: 'from-emerald-400', to: 'to-teal-500', shadow: 'shadow-emerald-500/20', bg: 'bg-emerald-50/60' },
  'bg-blue-50': { from: 'from-blue-400', to: 'to-indigo-500', shadow: 'shadow-blue-500/20', bg: 'bg-blue-50/60' },
  'bg-violet-50': { from: 'from-violet-400', to: 'to-purple-500', shadow: 'shadow-violet-500/20', bg: 'bg-violet-50/60' },
};

export function StatCard({ stat }: { stat: StatConfig }) {
  const Icon = stat.icon;
  const accent = ACCENT_GRADIENTS[stat.accent] ?? ACCENT_GRADIENTS['bg-amber-50'];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] hover:bg-white hover:-translate-y-0.5 transition-all duration-300">
      <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${accent.from} ${accent.to} opacity-60`} />
      
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent.from} ${accent.to} ${accent.shadow} shadow-lg text-white transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`mt-1 h-6 w-16 rounded-full ${accent.bg} flex items-center justify-center`}>
          <span className="text-[10px] font-bold text-slate-500">Live</span>
        </div>
      </div>
      
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{stat.label}</p>
      <p className="mt-0.5 text-xs text-slate-400">{stat.sublabel}</p>
    </div>
  );
}
