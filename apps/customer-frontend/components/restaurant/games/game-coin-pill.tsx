"use client";

import { Coins } from 'lucide-react';
import { cn } from '@/lib/cn';

type GameCoinPillProps = {
  coins: number;
  className?: string;
};

export function GameCoinPill({ coins, className }: GameCoinPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/24 px-3 py-2 text-white shadow-[0_16px_30px_rgba(7,60,73,0.2)] backdrop-blur-md',
        className,
      )}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#ffe4a0] bg-[linear-gradient(135deg,#f9d976,#f39f5a)] text-[#7a4a00] shadow-[0_10px_22px_rgba(243,159,90,0.32)]">
        <Coins className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-semibold tracking-[0.04em] text-white sm:text-base">
        {coins.toLocaleString()}
      </span>
    </div>
  );
}
