"use client";

import { BarChart3, Gamepad2, Coins } from 'lucide-react';

type Props = {
  lastPoints: number;
  highScore: number;
  roundsPlayed: number;
};

export function EatPlayGameStatScore({ lastPoints, highScore, roundsPlayed }: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
        <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">LAST EARNED</p>
        <p className="mt-0.5 flex items-center gap-2 font-display text-lg font-bold text-[rgb(var(--ink))]">
          <Coins className="h-4 w-4 text-amber-500" />
          +{lastPoints.toLocaleString()} pts
        </p>
      </div>
      <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
        <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">HIGH SCORE</p>
        <p className="mt-0.5 flex items-center gap-2 font-display text-lg font-bold text-[rgb(var(--ink))]">
          <BarChart3 className="h-4 w-4 text-[rgb(var(--brand))]" />
          {highScore.toLocaleString()}
        </p>
      </div>
      <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
        <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">TOTAL ROUNDS</p>
        <p className="mt-0.5 flex items-center gap-2 font-display text-lg font-bold text-[rgb(var(--ink))]">
          <Gamepad2 className="h-4 w-4 text-emerald-500" />
          {roundsPlayed.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
