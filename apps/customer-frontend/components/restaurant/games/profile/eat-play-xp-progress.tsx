import { Gamepad2 } from 'lucide-react';

interface EatPlayXpProgressProps {
  totalXP: number;
  neededXP: number;
  level: number;
  progress: number;
}

export function EatPlayXpProgress({ totalXP, neededXP, level, progress }: EatPlayXpProgressProps) {
  return (
    <div className="max-w-md space-y-3">
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">XP PROGRESSION</p>
          <p className="text-sm font-bold text-[rgb(var(--ink))]">{totalXP.toLocaleString()} <span className="text-[rgb(var(--muted))]">/ {(totalXP + neededXP).toLocaleString()} XP</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--brand))]">NEXT LEVEL</p>
          <p className="text-sm font-bold text-[rgb(var(--ink))]">LVL {level + 1}</p>
        </div>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 ring-1 ring-black/[0.05]">
        <div className="group relative h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)))] shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)] transition-all duration-1000" style={{ width: `${progress}%` }}>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--brand))]">
        <Gamepad2 className="h-4 w-4" />
        Play {neededXP} more rounds to rank up!
      </p>
    </div>
  );
}
