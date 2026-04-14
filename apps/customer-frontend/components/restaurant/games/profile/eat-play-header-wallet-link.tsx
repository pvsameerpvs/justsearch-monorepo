"use client";

import Link from 'next/link';
import { Coins } from 'lucide-react';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { cn } from '@/lib/cn';

type EatPlayHeaderWalletLinkProps = {
  className?: string;
};

export function EatPlayHeaderWalletLink({ className }: EatPlayHeaderWalletLinkProps) {
  const { points } = useLoyaltyPoints();

  return (
    <Link
      href="/eat-play/profile"
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.9)] bg-[linear-gradient(135deg,rgba(255,247,222,0.95),rgba(255,236,175,0.94))] px-3 text-[#7a4a00] shadow-sm transition-all active:scale-90',
        className,
      )}
      aria-label="Open game profile"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#ffe4a0] bg-[linear-gradient(135deg,#f9d976,#f39f5a)] text-[#7a4a00] shadow-[0_8px_18px_rgba(243,159,90,0.25)]">
        <Coins className="h-3.5 w-3.5" />
      </span>
      <span className="inline-flex items-center gap-1 text-[#7a4a00]">
        <span className="text-xs font-bold tracking-[0.08em]">
          {points.toLocaleString()}
        </span>
      </span>
    </Link>
  );
}
