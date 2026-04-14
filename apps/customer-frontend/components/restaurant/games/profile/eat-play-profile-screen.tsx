"use client";

import { useMemo, useState, useEffect } from 'react';
import { Coins, Gamepad2, Trophy, Sparkles } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { useUserGameStats } from '@/components/restaurant/use-user-game-stats';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { useRegistration } from '@/components/auth/registration-context';
import { EatPlayGameStatCard } from './eat-play-game-stat-card';

function formatLastPlayed(value: string) {
  if (!value) return 'No game played yet';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'No game played yet';

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function getTierDetails(points: number) {
  if (points >= 2000) return { label: 'PLATINUM', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', iconColor: 'text-sky-500' };
  if (points >= 1200) return { label: 'GOLD', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500' };
  if (points >= 600) return { label: 'SILVER', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', iconColor: 'text-slate-400' };
  return { label: 'ELITE', color: 'text-[rgb(var(--brand))]', bg: 'bg-[rgb(var(--brand-soft)/0.5)]', border: 'border-[rgb(var(--brand)/0.15)]', iconColor: 'text-[rgb(var(--brand))]' };
}

export function EatPlayProfileScreen() {
  const restaurant = useRestaurant();
  const { points } = useLoyaltyPoints();
  const { getGameStat } = useUserGameStats();
  const { user } = useRegistration();
  const userName = user?.name ?? 'Guest Explorer';

  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    setPlayerId(Math.floor(Math.random() * 9000) + 1000);
  }, []);

  const tier = useMemo(() => getTierDetails(points), [points]);

  const gameSnapshots = useMemo(() => {
    return restaurant.games
      .filter((game) => game.isAvailable)
      .map((game) => ({
        game,
        stat: getGameStat(game.id),
      }))
      .sort((a, b) => b.stat.highScore - a.stat.highScore);
  }, [getGameStat, restaurant.games]);

  const totals = useMemo(() => {
    let roundsPlayed = 0;
    let bestScore = 0;
    let playedGames = 0;
    let lastPlayed = '';

    for (const snapshot of gameSnapshots) {
      roundsPlayed += snapshot.stat.roundsPlayed;
      if (snapshot.stat.roundsPlayed > 0) {
        playedGames += 1;
      }
      if (snapshot.stat.highScore > bestScore) {
        bestScore = snapshot.stat.highScore;
      }
      if (snapshot.stat.lastPlayed && snapshot.stat.lastPlayed > lastPlayed) {
        lastPlayed = snapshot.stat.lastPlayed;
      }
    }

    // Level calculation: Every 10 rounds = 1 level
    const level = Math.floor(roundsPlayed / 10) + 1;
    const currentLevelRounds = roundsPlayed % 10;
    const progressToNextLevel = (currentLevelRounds / 10) * 100;
    const roundsNeeded = 10 - currentLevelRounds;

    return {
      roundsPlayed,
      bestScore,
      playedGames,
      lastPlayed,
      level,
      progressToNextLevel,
      roundsNeeded,
    };
  }, [gameSnapshots]);

  const topGame = useMemo(() => {
    if (gameSnapshots.length === 0) return null;
    const played = gameSnapshots.filter((snapshot) => snapshot.stat.roundsPlayed > 0);
    const source = played.length > 0 ? played : gameSnapshots;
    return [...source].sort((a, b) => b.stat.highScore - a.stat.highScore)[0] ?? null;
  }, [gameSnapshots]);

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="space-y-5">
          {/* Gaming Header - Epic Premium Theme */}
          <Surface className="relative overflow-hidden rounded-[40px] border-white/80 bg-[linear-gradient(145deg,rgba(var(--brand-rgb),0.1),rgba(255,255,255,0.98),rgba(var(--accent-rgb),0.08))] p-6 sm:p-12 shadow-xl shadow-black/5 ring-1 ring-black/[0.03]">
            {/* Immersive Decorative Background */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-soft)/0.5),transparent_70%)] blur-[100px]" />
            <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-soft)/0.4),transparent_70%)] blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            <div className="relative flex flex-col items-stretch gap-10 md:flex-row md:items-center">
              {/* Level / Rank Badge - Much more clear */}
              <div className="relative flex shrink-0 justify-center md:justify-start">
                <div className="group relative flex h-32 w-32 items-center justify-center">
                  {/* Rotating Outer Ring */}
                  <div className="absolute inset-0 rounded-[2.5rem] border-4 border-dashed border-[rgb(var(--brand)/0.2)] animate-[spin_20s_linear_infinite]" />
                  {/* Inner Badge */}
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white p-1.5 shadow-2xl ring-1 ring-black/[0.05] transition-transform group-hover:scale-105">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.6rem] bg-[linear-gradient(135deg,rgb(var(--brand)),rgb(var(--accent)))] text-white shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Level</span>
                      <span className="font-display text-5xl font-black leading-none">{totals.level}</span>
                    </div>
                  </div>
                  {/* Floating Rank Ornament */}
                  <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg ring-4 ring-white">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                      ID: PLR_{playerId || '....'}
                    </span>
                  </div>
                  <h1 className="mt-1 font-display text-4xl font-black tracking-tight text-[rgb(var(--ink))] sm:text-5xl">
                    {userName}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${tier.bg} px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${tier.color} ${tier.border} border shadow-sm transition-all`}>
                      <Sparkles className={`h-3 w-3 animate-pulse ${tier.iconColor}`} />
                      {tier.label} MEMBER
                    </span>
                  </div>
                </div>

                {/* Level Progress - Professional Detail */}
                <div className="max-w-md space-y-3">
                  <div className="flex items-end justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">XP PROGRESSION</p>
                      <p className="text-sm font-bold text-[rgb(var(--ink))]">
                        {totals.roundsPlayed.toLocaleString()} <span className="text-[rgb(var(--muted))]">/ { (totals.roundsPlayed + totals.roundsNeeded).toLocaleString() } XP</span>
                      </p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--brand))]">NEXT LEVEL</p>
                       <p className="text-sm font-bold text-[rgb(var(--ink))]">LVL {totals.level + 1}</p>
                    </div>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 ring-1 ring-black/[0.05]">
                    <div 
                      className="group relative h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)))] shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)] transition-all duration-1000"
                      style={{ width: `${totals.progressToNextLevel}%` }}
                    >
                      {/* Inner sheen effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--brand))]">
                    <Gamepad2 className="h-4 w-4" />
                    Play {totals.roundsNeeded} more rounds to rank up!
                  </p>
                </div>
              </div>

              {/* Play Credits - More "Wallet" style */}
              <div className="relative overflow-hidden rounded-[40px] border-2 border-white bg-white/70 p-7 shadow-2xl shadow-black/5 ring-1 ring-black/[0.02] backdrop-blur-xl md:min-w-[280px]">
                {/* Decorative floating coins */}
                <div className="absolute -right-6 -top-6 opacity-[0.08] pointer-events-none">
                   <Coins className="h-28 w-28 rotate-12 text-amber-600" />
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">
                      GAME WALLET
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="font-display text-5xl font-black tracking-tight text-amber-600">
                        {points.toLocaleString()}
                      </p>
                      <span className="text-xs font-bold text-amber-600/60 uppercase">Coins</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-600 shadow-inner">
                    <Coins className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button 
                    type="button"
                    className="group/redeem relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#d97706)] p-4 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                       <Sparkles className="h-4 w-4 animate-pulse text-amber-200" />
                       <span className="text-sm font-black uppercase tracking-widest">Redeem Points</span>
                    </div>
                    {/* Hover sheen */}
                    <div className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] transition-transform duration-700 group-hover/redeem:translate-x-[100%]" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-amber-700/70">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    3 REWARDS READY TO UNLOCK
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="relative mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-white/50 bg-white/30 p-4 backdrop-blur-sm sm:grid-cols-4 sm:p-6">
              {[
                { label: 'CHALLENGES', value: `${totals.playedGames} / ${restaurant.games.length}` },
                { label: 'TOTAL ROUNDS', value: totals.roundsPlayed.toLocaleString() },
                { label: 'PERSONAL BEST', value: totals.bestScore.toLocaleString() },
                { 
                  label: 'LAST PLAYED', 
                  value: totals.lastPlayed ? formatLastPlayed(totals.lastPlayed).toUpperCase() : 'NO HISTORY',
                  isExtraSmall: true
                }
              ].map((item, idx) => (
                <div key={item.label} className={`flex flex-col px-2 ${idx < 3 ? 'sm:border-r border-black/[0.03]' : ''} ${idx % 2 === 0 ? 'border-r border-black/[0.03]' : ''}`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[rgb(var(--muted))]">{item.label}</p>
                  <p className={`mt-1 font-display ${item.isExtraSmall ? 'text-[10px] truncate mt-2 font-black text-[rgb(var(--brand))] opacity-80' : 'text-2xl font-black text-[rgb(var(--ink))]'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Surface>

          {/* Game Library Section */}
          <div className="space-y-4 px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-4 w-1 rounded-full bg-[rgb(var(--brand))]" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-[rgb(var(--muted))]">
                  Available Games
                </h2>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[rgb(var(--brand))] shadow-sm ring-1 ring-black/[0.05]">
                {gameSnapshots.length} Challenges
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              {gameSnapshots.map((snapshot) => (
                <EatPlayGameStatCard
                  key={snapshot.game.id}
                  game={snapshot.game}
                  stat={snapshot.stat}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
