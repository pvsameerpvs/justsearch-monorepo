import { Sparkles } from 'lucide-react';
import { getTierUI } from './eat-play-profile-utils';

interface EatPlayProfileHeaderProps {
  userName: string;
  playerId: string;
  tierLabel: string;
}

export function EatPlayProfileHeader({ userName, playerId, tierLabel }: EatPlayProfileHeaderProps) {
  const tier = getTierUI(tierLabel);

  return (
    <div className="flex-1 space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">ID: PLR_{playerId}</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-black tracking-tight text-[rgb(var(--ink))] sm:text-5xl">{userName}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full ${tier.bg} px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${tier.color} ${tier.border} border shadow-sm transition-all`}>
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <Sparkles className={`relative inline-flex h-2 w-2 ${tier.iconColor}`} />
            </span>
            {tier.label} MEMBER
          </span>
        </div>
      </div>
    </div>
  );
}
