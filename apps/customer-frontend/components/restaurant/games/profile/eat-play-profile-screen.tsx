"use client";

import { useMemo } from 'react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { useUserGameStats } from '@/components/restaurant/use-user-game-stats';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { useRegistration } from '@/components/auth/registration-context';
import { getLoyaltyTier, calculatePlayerLevel, getStablePlayerId } from '@/lib/loyalty-utils';
import { EatPlayLevelBadge } from './eat-play-level-badge';
import { EatPlayProfileHeader } from './eat-play-profile-header';
import { EatPlayXpProgress } from './eat-play-xp-progress';
import { EatPlayWalletCard } from './eat-play-wallet-card';
import { EatPlayProfileStats } from './eat-play-profile-stats';
import { EatPlayGameList } from './eat-play-game-list';

export function EatPlayProfileScreen() {
  const restaurant = useRestaurant();
  const { points } = useLoyaltyPoints();
  const { getGameStat } = useUserGameStats();
  const { user } = useRegistration();
  const userName = user?.name ?? 'Guest Explorer';

  const tierLabel = getLoyaltyTier(points);
  const playerId = getStablePlayerId(user?.mobile || userName);

  const gameSnapshots = useMemo(() => {
    return restaurant.games
      .filter((game) => game.isAvailable)
      .map((game) => ({ game, stat: getGameStat(game.id) }))
      .sort((a, b) => b.stat.highScore - a.stat.highScore);
  }, [getGameStat, restaurant.games]);

  const totals = useMemo(() => {
    let roundsPlayed = 0;
    let totalPoints = 0;
    let playedGames = 0;
    let lastPlayed = '';

    for (const snapshot of gameSnapshots) {
      roundsPlayed += snapshot.stat.roundsPlayed;
      totalPoints += snapshot.stat.totalPoints;
      if (snapshot.stat.roundsPlayed > 0) playedGames += 1;
      if (snapshot.stat.lastPlayed && snapshot.stat.lastPlayed > lastPlayed) {
        lastPlayed = snapshot.stat.lastPlayed;
      }
    }

    return { ...calculatePlayerLevel(roundsPlayed), roundsPlayed, totalPoints, playedGames, lastPlayed };
  }, [gameSnapshots]);

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="space-y-6">
          <Surface className="relative overflow-hidden rounded-[40px] border-white/80 bg-[linear-gradient(145deg,rgba(var(--brand-rgb),0.1),rgba(255,255,255,0.98),rgba(var(--accent-rgb),0.08))] p-6 sm:p-12 shadow-xl shadow-black/5 ring-1 ring-black/[0.03]">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-soft)/0.5),transparent_70%)] blur-[100px]" />
            <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-soft)/0.4),transparent_70%)] blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

            <div className="relative flex flex-col items-stretch gap-10 md:flex-row md:items-center">
              <EatPlayLevelBadge level={totals.level} />
              <div className="flex-1 space-y-6">
                <EatPlayProfileHeader userName={userName} playerId={playerId} tierLabel={tierLabel} />
                <EatPlayXpProgress totalXP={totals.totalXP} neededXP={totals.neededXP} level={totals.level} progress={totals.progress} />
              </div>
              <EatPlayWalletCard points={points} />
            </div>

            <EatPlayProfileStats playedGames={totals.playedGames} totalGames={restaurant.games.length} roundsPlayed={totals.roundsPlayed} totalPoints={totals.totalPoints} lastPlayed={totals.lastPlayed} />
          </Surface>

          <EatPlayGameList snapshots={gameSnapshots} />
        </div>
      </Container>
    </section>
  );
}
