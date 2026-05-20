import { Gamepad2 } from 'lucide-react';

interface EatPlayXpProgressProps {
  currentLevelXP: number;
  xpPerLevel: number;
  neededXP: number;
  level: number;
  progress: number;
}

function getMotivation(progress: number, neededXP: number, nextLevel: number) {
  if (progress === 0) return `Earn ${neededXP} points to reach Level ${nextLevel}!`;
  if (progress < 25) return `Good start! ${neededXP} points to Level ${nextLevel}.`;
  if (progress < 50) return `Keep going! ${neededXP} points to Level ${nextLevel}.`;
  if (progress < 75) return `Halfway there! ${neededXP} points to Level ${nextLevel}.`;
  if (progress < 90) return `Almost there! ${neededXP} points to Level ${nextLevel}.`;
  return `So close! Just ${neededXP} points to Level ${nextLevel}!`;
}

export function EatPlayXpProgress({ currentLevelXP, xpPerLevel, neededXP, level, progress }: EatPlayXpProgressProps) {
  const message = getMotivation(progress, neededXP, level + 1);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">Level Progress</p>
          <p className="text-sm font-bold text-[rgb(var(--ink))]">
            {currentLevelXP.toLocaleString()} <span className="text-[rgb(var(--muted))]">/ {xpPerLevel.toLocaleString()} XP</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--brand))]">Next Level</p>
          <p className="text-sm font-bold text-[rgb(var(--ink))]">LVL {level + 1}</p>
        </div>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ring-1 ring-black/[0.05]">
        <div
          className="relative h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)))] shadow-[0_0_12px_rgba(var(--brand-rgb),0.35)] transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(progress, 2)}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--brand))]">
        <Gamepad2 className="h-4 w-4 shrink-0" />
        {message}
      </p>
    </div>
  );
}
