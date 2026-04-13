"use client";

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Game } from '@/lib/restaurant-types';
import type { GameAwardResult } from './games/game-award';
import { GameCoinPill } from './games/game-coin-pill';
import { GameExitConfirmDialog } from './games/game-exit-confirm-dialog';
import { GameIntroStage } from './games/game-intro-stage';
import { GamePlayerStage } from './games/game-player-stage';
import { useRegistration } from '@/components/auth/registration-context';
import { useSmartBackNavigation } from '@/components/layout/use-smart-back-navigation';
import { useLoyaltyPoints } from './use-loyalty-points';
import { useUserGameStats } from './use-user-game-stats';

type RestaurantGameScreenProps = {
  game: Game;
  mode?: 'intro' | 'play';
};

export function RestaurantGameScreen({ game, mode = 'intro' }: RestaurantGameScreenProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isRegistered, openModal } = useRegistration();
  const { points, addPoints } = useLoyaltyPoints();
  const { updateGameStat, getGameStat } = useUserGameStats();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const isIntro = mode === 'intro';
  const backFallbackPath = useMemo(
    () => (isIntro ? '/eat-play' : `/eat-play/${game.id}`),
    [game.id, isIntro],
  );
  const goBack = useSmartBackNavigation(pathname, backFallbackPath);
  const gameStat = getGameStat(game.id);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      root.style.overscrollBehavior = previous.rootOverscroll;
      body.style.overscrollBehavior = previous.bodyOverscroll;
    };
  }, []);

  const onAward = useCallback(
    (result: GameAwardResult) => {
      addPoints(result.points);
      updateGameStat(game.id, result.score, result.level);
    },
    [addPoints, game.id, updateGameStat],
  );

  const handleStart = useCallback(() => {
    if (!isRegistered) {
      openModal();
      return;
    }

    router.push(`/eat-play/${game.id}/play`);
  }, [game.id, isRegistered, openModal, router]);

  const handleBackPress = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const handleExitConfirm = useCallback(() => {
    setIsExitDialogOpen(false);
    goBack();
  }, [goBack]);

  return (
    <section className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_22%_18%,#8ee6f0_0%,#62d1dc_32%,#34b8c5_70%,#2797a8_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.32),transparent_42%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_50%_84%,rgba(4,65,78,0.22),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 h-56 w-56 rounded-full bg-white/14 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-24 h-60 w-60 rounded-full bg-[#0e6f83]/26 blur-3xl"
      />

      <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] sm:px-6">
        <button
          type="button"
          onClick={handleBackPress}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/22 text-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
          aria-label="Back to games"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <GameCoinPill coins={points} />
      </div>

      {isIntro ? (
        <>
          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <GameIntroStage
              game={game}
              onStart={handleStart}
              hasPlayed={gameStat.roundsPlayed > 0}
              lastScore={gameStat.lastScore}
              highScore={gameStat.highScore}
              communityTopScore={game.communityTopScore}
            />
          </div>

          <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] left-1/2 z-10 -translate-x-1/2">
            <Image
              src="/games/logo-justsearch.png"
              alt="Just Search"
              width={160}
              height={42}
              priority
              className="h-auto w-[110px] object-contain drop-shadow-[0_8px_20px_rgba(3,43,53,0.3)] sm:w-[130px]"
            />
          </div>
        </>
      ) : (
        <GamePlayerStage game={game} onAward={onAward} />
      )}

      <GameExitConfirmDialog
        open={isExitDialogOpen}
        onCancel={() => setIsExitDialogOpen(false)}
        onConfirm={handleExitConfirm}
      />
    </section>
  );
}
