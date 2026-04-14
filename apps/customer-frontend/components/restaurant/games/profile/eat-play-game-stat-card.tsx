"use client";

import Link from 'next/link';
import { Trophy, BarChart3, Clock3, Target, Play } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { Game } from '@/lib/restaurant-types';

type GameStatSnapshot = {
  highScore: number;
  lastScore: number;
  roundsPlayed: number;
  lastPlayed: string;
};

type EatPlayGameStatCardProps = {
  game: Game;
  stat: GameStatSnapshot;
};

function formatPlayedAt(value: string) {
  if (!value) return 'Not played yet';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'Not played yet';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function EatPlayGameStatCard({ game, stat }: EatPlayGameStatCardProps) {
  const hasPlayed = stat.roundsPlayed > 0;
  const communityTop = typeof game.communityTopScore === 'number' ? game.communityTopScore : 0;
  const progressToTop =
    communityTop > 0 ? Math.min(100, Math.round((stat.highScore / communityTop) * 100)) : 0;

  return (
    <Surface className="rounded-[26px] border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(247,252,255,0.94))] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[rgb(var(--border)/0.9)] bg-[rgb(var(--card-surface-muted)/0.9)]">
            {game.coverImageUrl ? (
              <img
                src={game.coverImageUrl}
                alt={game.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,rgb(var(--brand-soft)/0.55),rgb(var(--accent-soft)/0.45))] text-2xl">
                <span aria-hidden="true">{game.icon}</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              {game.id}
            </p>
            <h3 className="mt-1 truncate font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              {game.name}
            </h3>
            <p className="mt-1 truncate text-xs font-medium text-[rgb(var(--muted))]">
              {game.prize}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full border border-[rgb(var(--border)/0.9)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--brand))]">
            {hasPlayed ? 'Played' : 'New'}
          </span>
          {communityTop > 0 ? (
            <span className="rounded-full bg-[rgb(var(--brand-soft)/0.5)] px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-[rgb(var(--brand))]">
              Top: {communityTop.toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/90 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
            Best
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-[rgb(var(--ink))]">
            <Trophy className="h-4 w-4 text-amber-500" />
            {stat.highScore.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/90 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
            Last Score
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-[rgb(var(--ink))]">
            <BarChart3 className="h-4 w-4 text-[rgb(var(--brand))]" />
            {stat.lastScore.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/90 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
            Top Goal
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-[rgb(var(--ink))]">
            <Target className="h-4 w-4 text-sky-600" />
            {communityTop > 0 ? communityTop.toLocaleString() : '-'}
          </p>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/90 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
            Rounds
          </p>
          <p className="mt-2 text-base font-semibold text-[rgb(var(--ink))]">
            {stat.roundsPlayed.toLocaleString()}
          </p>
        </div>
      </div>

      {communityTop > 0 ? (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-semibold text-[rgb(var(--muted))]">
            <span>Progress to community top score</span>
            <span>{progressToTop}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)))]"
              style={{ width: `${progressToTop}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-medium text-[rgb(var(--muted))]">
          <Clock3 className="h-3.5 w-3.5" />
          Last played: {formatPlayedAt(stat.lastPlayed)}
        </p>

        <Link
          href={`/eat-play/${game.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border)/0.9)] bg-[rgb(var(--brand-soft)/0.55)] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--brand))] transition-all hover:bg-[rgb(var(--brand-soft)/0.75)]"
        >
          <Play className="h-3.5 w-3.5" />
          Play
        </Link>
      </div>
    </Surface>
  );
}
