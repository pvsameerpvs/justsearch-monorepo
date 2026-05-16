"use client";

import { Trophy, Coins } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { Game } from '@/lib/restaurant-types';
import { EatPlayGameStatIcon } from './eat-play-game-stat-icon';
import { EatPlayGameStatScore } from './eat-play-game-stat-score';
import { EatPlayGameStatBar } from './eat-play-game-stat-bar';

type GameStatSnapshot = {
  highScore: number;
  lastScore: number;
  lastPoints: number;
  totalPoints: number;
  roundsPlayed: number;
  lastPlayed: string;
};

type EatPlayGameStatCardProps = {
  game: Game;
  stat: GameStatSnapshot;
};

function getRankDetails(points: number, hasPlayed: boolean) {
  if (points >= 10000) return { label: 'IMMORTAL', color: 'text-orange-600', bg: 'bg-orange-50' };
  if (points >= 5000) return { label: 'LEGEND', color: 'text-purple-600', bg: 'bg-purple-50' };
  if (points >= 1000) return { label: 'VETERAN', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (hasPlayed) return { label: 'CONTENDER', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  return { label: 'ROOKIE', color: 'text-slate-500', bg: 'bg-slate-50' };
}

export function EatPlayGameStatCard({ game, stat }: EatPlayGameStatCardProps) {
  const hasPlayed = stat.roundsPlayed > 0;
  const rank = getRankDetails(stat.totalPoints, hasPlayed);

  return (
    <Surface className="relative overflow-hidden rounded-[36px] border-white bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.03]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgb(var(--brand-soft)/0.2)] blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <EatPlayGameStatIcon game={game} hasPlayed={hasPlayed} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.25em] text-[rgb(var(--brand))]">
                {game.tag || (game.id.includes('vex') ? 'VEX SYSTEM' : 'ARCADE')}
              </p>
              {hasPlayed && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black ${rank.bg} ${rank.color} border border-current/10 uppercase tracking-widest`}>
                  <Trophy className="h-3 w-3" /> {rank.label}
                </span>
              )}
            </div>
            <h3 className="mt-1 truncate font-display text-2xl font-black tracking-tight text-[rgb(var(--ink))]">
              {game.name}
            </h3>
            <p className="mt-1 truncate text-xs font-bold text-[rgb(var(--muted))] uppercase tracking-tight">
              WIN <span className="text-emerald-600 font-black">{game.prize}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-start self-end md:self-start">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">TOTAL POINTS</p>
            <div className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-500" />
              <p className="font-display text-xl font-black text-amber-600">{stat.totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <EatPlayGameStatScore lastPoints={stat.lastPoints} highScore={stat.highScore} roundsPlayed={stat.roundsPlayed} />
      <EatPlayGameStatBar gameId={game.id} lastPlayed={stat.lastPlayed} />
    </Surface>
  );
}
