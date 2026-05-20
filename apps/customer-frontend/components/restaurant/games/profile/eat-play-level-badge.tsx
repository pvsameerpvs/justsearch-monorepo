import { getLevelTitle } from './eat-play-profile-utils';

interface EatPlayLevelBadgeProps {
  level: number;
  progress: number;
}

export function EatPlayLevelBadge({ level, progress }: EatPlayLevelBadgeProps) {
  const title = getLevelTitle(level);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex shrink-0 flex-col items-center gap-3">
      <div className="relative flex h-[132px] w-[132px] items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 132 132">
          <circle cx="66" cy="66" r={radius} fill="none" stroke="rgb(var(--brand)/0.12)" strokeWidth="6" />
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke="rgb(var(--brand))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="relative flex h-[104px] w-[104px] flex-col items-center justify-center rounded-[2rem] bg-white shadow-xl ring-1 ring-black/[0.05]">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[rgb(var(--muted))]">{title}</span>
          <span className="font-display text-4xl font-black leading-none text-[rgb(var(--brand))]">{level}</span>
        </div>
      </div>
    </div>
  );
}
