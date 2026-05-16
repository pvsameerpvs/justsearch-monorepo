"use client";

import Link from 'next/link';
import { Clock3, Play } from 'lucide-react';

function formatPlayedAt(value: string) {
  if (!value) return 'Not played yet';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'Not played yet';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}

type Props = {
  gameId: string;
  lastPlayed: string;
};

export function EatPlayGameStatBar({ gameId, lastPlayed }: Props) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-black/[0.03] pt-5">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
        <Clock3 className="h-3 w-3" />
        RECORDED {formatPlayedAt(lastPlayed).toUpperCase()}
      </p>
      <Link
        href={`/eat-play/${gameId}`}
        className="group/play flex items-center gap-2 rounded-2xl bg-[rgb(var(--brand))] px-5 py-2.5 text-white shadow-lg shadow-[rgb(var(--brand-rgb)/0.3)] transition-all hover:scale-105 hover:shadow-[rgb(var(--brand-rgb)/0.5)] active:scale-95"
      >
        <span className="text-[10px] font-black uppercase tracking-widest">Play</span>
        <Play className="h-3.5 w-3.5 fill-current" />
      </Link>
    </div>
  );
}
