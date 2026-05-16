"use client";

import Image from 'next/image';
import type { Game } from '@/lib/restaurant-types';

type Props = {
  game: Game;
  hasPlayed: boolean;
};

export function EatPlayGameStatIcon({ game, hasPlayed }: Props) {
  return (
    <div className="relative shrink-0">
      <div className="h-20 w-20 overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-xl ring-1 ring-black/[0.05]">
        {game.coverImageUrl ? (
          <Image src={game.coverImageUrl} alt={game.name} width={80} height={80} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgb(var(--brand-soft)),rgb(var(--accent-soft)))] text-4xl">
            <span aria-hidden="true">{game.icon}</span>
          </div>
        )}
      </div>
      {hasPlayed && (
        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg ring-2 ring-white">
          <span className="text-[10px] font-black italic">TOP</span>
        </div>
      )}
    </div>
  );
}
