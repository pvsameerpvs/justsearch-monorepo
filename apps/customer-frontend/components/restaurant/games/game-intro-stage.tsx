"use client";

import Image from 'next/image';
import type { Game } from '@/lib/restaurant-types';

type GameIntroStageProps = {
  game: Game;
  onStart: () => void;
  hasPlayed?: boolean;
  lastScore?: number;
  highScore?: number;
  communityTopScore?: number;
};

export function GameIntroStage({
  game,
  onStart,
  hasPlayed = false,
  lastScore = 0,
  highScore = 0,
  communityTopScore,
}: GameIntroStageProps) {
  const coverImageUrl = game.coverImageUrl;

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center justify-center px-4 text-white">
      <div className="relative w-full max-w-[340px]">
        <div
          aria-hidden="true"
          className="absolute inset-5 rounded-full bg-[radial-gradient(circle,#ffffff52_0%,#ffffff10_54%,transparent_76%)] blur-lg"
        />
        <div className="relative aspect-square w-full rounded-full border border-white/45 bg-white/8 shadow-[0_34px_80px_rgba(10,67,83,0.3)]">
          <div className="absolute inset-[8%] overflow-hidden rounded-full border border-white/40 bg-white/12">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={game.name}
                fill
                priority
                sizes="(max-width: 640px) 74vw, 340px"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl drop-shadow-[0_20px_40px_rgba(15,23,42,0.22)]">
                <span aria-hidden="true">{game.icon}</span>
              </div>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24)]"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex h-14 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(180deg,#fff5d5,#ffd965)] px-12 text-base font-semibold tracking-[0.08em] text-[#755000] shadow-[0_20px_44px_rgba(255,213,94,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        Start
      </button>

      {hasPlayed || typeof communityTopScore === 'number' ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {typeof communityTopScore === 'number' ? (
            <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
              Top Score: {communityTopScore.toLocaleString()}
            </p>
          ) : null}
          <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
            Last Score: {lastScore}
          </p>
          <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
            Best: {highScore}
          </p>
        </div>
      ) : null}
    </div>
  );
}
