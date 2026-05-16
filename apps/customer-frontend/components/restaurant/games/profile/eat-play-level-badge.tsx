import { Trophy } from 'lucide-react';

interface EatPlayLevelBadgeProps {
  level: number;
}

export function EatPlayLevelBadge({ level }: EatPlayLevelBadgeProps) {
  return (
    <div className="relative flex shrink-0 justify-center md:justify-start">
      <div className="group relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-[2.5rem] border-4 border-dashed border-[rgb(var(--brand)/0.2)] animate-[spin_20s_linear_infinite]" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white p-1.5 shadow-2xl ring-1 ring-black/[0.05] transition-transform group-hover:scale-105">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.6rem] bg-[linear-gradient(135deg,rgb(var(--brand)),rgb(var(--accent)))] text-white shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Level</span>
            <span className="font-display text-5xl font-black leading-none">{level}</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg ring-4 ring-white">
          <Trophy className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
