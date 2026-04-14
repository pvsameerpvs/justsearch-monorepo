"use client";

import Link from 'next/link';
import { Trophy, BarChart3, Clock3, Target, Gamepad2, Play } from 'lucide-react';
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

const TOP_CHALLENGERS = [
  { name: 'S. Ahmed', score: 14205, restaurant: 'Mosaic Table', rank: 1, color: 'text-amber-500' },
  { name: 'L. Chen', score: 12940, restaurant: 'Spice Garden', rank: 2, color: 'text-slate-400' },
  { name: 'M. Rossi', score: 11820, restaurant: 'The Burger Joint', rank: 3, color: 'text-orange-400' }
];

function getRankDetails(progress: number, hasPlayed: boolean) {
  if (progress >= 90) return { label: 'IMMORTAL', color: 'text-orange-600', bg: 'bg-orange-50' };
  if (progress >= 70) return { label: 'LEGEND', color: 'text-purple-600', bg: 'bg-purple-50' };
  if (progress >= 40) return { label: 'VETERAN', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (hasPlayed) return { label: 'CONTENDER', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  return { label: 'ROOKIE', color: 'text-slate-500', bg: 'bg-slate-50' };
}

export function EatPlayGameStatCard({ game, stat }: EatPlayGameStatCardProps) {
  const hasPlayed = stat.roundsPlayed > 0;
  const communityTop = typeof game.communityTopScore === 'number' ? game.communityTopScore : 0;
  const progressToTop = communityTop > 0 ? Math.min(100, Math.round((stat.highScore / communityTop) * 100)) : 0;
  const rank = getRankDetails(progressToTop, hasPlayed);

  return (
    <Surface className="relative overflow-hidden rounded-[36px] border-white bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.03]">
      {/* Dynamic decorative backdrop */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgb(var(--brand-soft)/0.2)] blur-3xl" />
      
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          {/* Game Cover / Icon */}
          <div className="relative shrink-0">
             <div className="h-20 w-20 overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-xl ring-1 ring-black/[0.05]">
              {game.coverImageUrl ? (
                <img
                  src={game.coverImageUrl}
                  alt={game.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
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
              <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">PERSONAL BEST</p>
              <p className="font-display text-xl font-black text-[rgb(var(--ink))]">
                {stat.highScore.toLocaleString()}
              </p>
           </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
          <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">RECENT SCORE</p>
          <p className="mt-0.5 flex items-center gap-2 font-display text-lg font-bold text-[rgb(var(--ink))]">
             <BarChart3 className="h-4 w-4 text-[rgb(var(--brand))]" />
             {stat.lastScore.toLocaleString()}
          </p>
        </div>
        <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
          <p className="text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">TOTAL ROUNDS</p>
          <p className="mt-0.5 flex items-center gap-2 font-display text-lg font-bold text-[rgb(var(--ink))]">
             <Gamepad2 className="h-4 w-4 text-emerald-500" />
             {stat.roundsPlayed.toLocaleString()}
          </p>
        </div>
        {communityTop > 0 && (
          <div className="flex-[2] min-w-[200px] rounded-2xl bg-slate-50/80 p-3 ring-1 ring-black/[0.02]">
            <div className="mb-2 flex items-center justify-between gap-2 text-[9px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">
              <span>PROGRESS TO TOP SCORE ({communityTop.toLocaleString()})</span>
              <span className="text-[rgb(var(--brand))]">{progressToTop}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ring-1 ring-black/[0.02]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)))] transition-all duration-1000"
                style={{ width: `${progressToTop}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Community Leaderboard Snippet */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2 opacity-80">
          <Trophy className="h-3 w-3 text-amber-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[rgb(var(--muted))]">TOP CHALLENGERS</p>
        </div>
        
        <div className="space-y-3">
          {TOP_CHALLENGERS.map((scorer) => (
            <div key={scorer.rank} className="flex items-center justify-between rounded-2xl bg-slate-50/50 px-4 py-2.5 ring-1 ring-black/[0.02]">
              <div className="flex items-center gap-3">
                <span className={`font-display text-xs font-black ${scorer.color}`}>#{scorer.rank}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-[rgb(var(--ink))]">{scorer.name}</p>
                  <p className="truncate text-[9px] font-bold text-[rgb(var(--muted))] uppercase tracking-tighter">at {scorer.restaurant}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="font-display text-xs font-black text-[rgb(var(--brand))]">
                   {scorer.score.toLocaleString()}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-black/[0.03] pt-5">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
          <Clock3 className="h-3 w-3" />
          RECORDED {formatPlayedAt(stat.lastPlayed).toUpperCase()}
        </p>

        <Link 
          href={`/eat-play/${game.id}`}
          className="group/play flex items-center gap-2 rounded-2xl bg-[rgb(var(--brand))] px-5 py-2.5 text-white shadow-lg shadow-[rgb(var(--brand-rgb)/0.3)] transition-all hover:scale-105 hover:shadow-[rgb(var(--brand-rgb)/0.5)] active:scale-95"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Play</span>
          <Play className="h-3.5 w-3.5 fill-current" />
        </Link>
      </div>
    </Surface>
  );
}
