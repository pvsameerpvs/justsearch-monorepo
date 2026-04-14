"use client";

import { useMemo } from 'react';
import { Coins, Gamepad2, Trophy, Clock3, Sparkles } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { useUserGameStats } from '@/components/restaurant/use-user-game-stats';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
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

export function EatPlayProfileScreen() {
  const restaurant = useRestaurant();
  const { points } = useLoyaltyPoints();
  const { getGameStat } = useUserGameStats();

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

    return {
      roundsPlayed,
      bestScore,
      playedGames,
      lastPlayed,
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
          <Surface className="relative overflow-hidden rounded-[30px] border-white/75 bg-[linear-gradient(145deg,rgba(255,247,222,0.95),rgba(255,255,255,0.98),rgba(240,249,255,0.9))] p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[rgb(var(--brand-soft)/0.65)] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[rgb(var(--accent-soft)/0.6)] blur-2xl"
            />

            <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
              Game Profile
            </p>
            <h1 className="relative mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
              My Game Details
            </h1>
            <p className="relative mt-2 text-sm font-medium text-[rgb(var(--muted))]">
              Track your scores and progress across all games in this restaurant.
            </p>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-4">
              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/85 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                  Gold Coins
                </p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em] text-amber-700">
                  <Coins className="h-5 w-5" />
                  {points.toLocaleString()}
                </p>
              </div>

              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/85 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                  Games Played
                </p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                  <Gamepad2 className="h-5 w-5 text-[rgb(var(--brand))]" />
                  {totals.playedGames}
                </p>
              </div>

              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/85 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                  Total Rounds
                </p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                  {totals.roundsPlayed.toLocaleString()}
                </p>
              </div>

              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/85 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                  Best Score
                </p>
                <p className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  {totals.bestScore.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
              <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/80 px-4 text-xs font-medium text-[rgb(var(--muted))]">
                <Clock3 className="h-4 w-4 text-[rgb(var(--brand))]" />
                Last played: {formatLastPlayed(totals.lastPlayed)}
              </div>
              <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/80 px-4 text-xs font-medium text-[rgb(var(--muted))]">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Top game: {topGame ? topGame.game.name : 'Play a game to unlock'}
              </div>
            </div>
          </Surface>

          <div className="space-y-2 px-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Your Game Library
            </p>
          </div>

          <div className="space-y-4">
            {gameSnapshots.map((snapshot) => (
              <EatPlayGameStatCard
                key={snapshot.game.id}
                game={snapshot.game}
                stat={snapshot.stat}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
