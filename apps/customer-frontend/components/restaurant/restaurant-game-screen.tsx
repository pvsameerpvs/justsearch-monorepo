"use client";
import { useCallback, useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Game } from '@/lib/restaurant-types';
import type { GameAwardResult } from '@/components/restaurant/games/game-award';
import { GameExitConfirmDialog } from '@/components/restaurant/games/game-exit-confirm-dialog';
import { GameIntroStage } from '@/components/restaurant/games/game-intro-stage';
import { GamePlayerStage } from '@/components/restaurant/games/game-player-stage';
import { submitScore } from '@/components/restaurant/games/use-submit-score';
import { useRegistration } from '@/components/auth/registration-context';
import { useSmartBackNavigation } from '@/components/layout/use-smart-back-navigation';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { useUserGameStats } from '@/components/restaurant/use-user-game-stats';
import { useScrollLock } from '@/components/restaurant/use-scroll-lock';
import { GameBackground } from '@/components/restaurant/game-background';
import { GameHeader } from '@/components/restaurant/game-header';
import { GameAdOverlays } from '@/components/restaurant/game-ad-overlays';
import { useAdStore } from '@/components/restaurant/games/ad/ad-store';
import { TransitionLoader } from '@/components/shared/transition-loader';
interface Props { game: Game; mode?: 'intro' | 'play'; }

type TransitionState = 'idle' | 'navigating' | 'processing' | 'navigating-back';

export function RestaurantGameScreen({ game, mode = 'intro' }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { isRegistered, openModal } = useRegistration();
  const { points, addPoints } = useLoyaltyPoints();
  const { updateGameStat, getGameStat } = useUserGameStats();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [showAdOnGameEnd, setShowAdOnGameEnd] = useState(false);
  const [showAdOnBack, setShowAdOnBack] = useState(false);
  const [pendingAward, setPendingAward] = useState<GameAwardResult | null>(null);
  const [transition, setTransition] = useState<TransitionState>('idle');
  const isIntro = mode === 'intro';
  const backFallbackPath = useMemo(() => (isIntro ? '/eat-play' : `/eat-play/${game.id}`), [game.id, isIntro]);
  const goBack = useSmartBackNavigation(pathname, backFallbackPath);
  const gameStat = getGameStat(game.id);
  useScrollLock(true);

  // Kickstart ad prefetch while user plays, reset on unmount to avoid stale data for next game
  useEffect(() => {
    useAdStore.getState().prefetch(game.id, 'mosaic-table');
    return () => { useAdStore.getState().reset(); };
  }, [game.id]);

  const processAward = useCallback(async (result: GameAwardResult) => {
    const { pointsAwarded } = await submitScore(game.id, result.score, result.level);
    addPoints(pointsAwarded);
    updateGameStat(game.id, result.score, pointsAwarded, result.level);
  }, [addPoints, game.id, updateGameStat]);

  const onAward = useCallback((result: GameAwardResult) => { setPendingAward(result); setShowAdOnGameEnd(true); }, []);

  const handleGameEndAdDone = useCallback(async () => {
    setShowAdOnGameEnd(false);
    if (pendingAward) {
      setTransition('processing');
      await processAward(pendingAward);
      setPendingAward(null);
      setTransition('idle');
    }
  }, [pendingAward, processAward]);

  const handleStart = useCallback(() => {
    if (!isRegistered) { openModal(); return; }
    setTransition('navigating');
    router.push(`/eat-play/${game.id}/play`);
  }, [isRegistered, openModal, game.id, router]);

  const handleBackPress = useCallback(() => {
    if (!isIntro) { setShowAdOnBack(true); return; }
    setIsExitDialogOpen(true);
  }, [isIntro]);

  const handleBackAdDone = useCallback(() => { setShowAdOnBack(false); setIsExitDialogOpen(true); }, []);
  const handleExitConfirm = useCallback(() => { setIsExitDialogOpen(false); setTransition('navigating-back'); goBack(); }, [goBack]);
  return (
    <section className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_22%_18%,#8ee6f0_0%,#62d1dc_32%,#34b8c5_70%,#2797a8_100%)]">
      <GameBackground />
      <GameHeader onBack={handleBackPress} coins={points} />
      {isIntro ? (
        <>
          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <GameIntroStage game={game} onStart={handleStart} isNavigating={transition === 'navigating'} hasPlayed={gameStat.roundsPlayed > 0} lastScore={gameStat.lastScore} highScore={gameStat.highScore} communityTopScore={game.communityTopScore} />
          </div>
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] left-1/2 z-10 -translate-x-1/2">
            <Image src="/games/logo-justsearch.png" alt="Just Search" width={160} height={42} priority className="h-auto w-[110px] object-contain drop-shadow-[0_8px_20px_rgba(3,43,53,0.3)] sm:w-[130px]" />
          </div>
        </>
      ) : <GamePlayerStage game={game} onAward={onAward} coins={points} />}
      <GameAdOverlays showAdOnGameEnd={showAdOnGameEnd} showAdOnBack={showAdOnBack} restaurantId="mosaic-table" gameId={game.id} onGameEndComplete={handleGameEndAdDone} onBackComplete={handleBackAdDone} />
      <GameExitConfirmDialog open={isExitDialogOpen} onCancel={() => setIsExitDialogOpen(false)} onConfirm={handleExitConfirm} />
      {transition !== 'idle' && <TransitionLoader />}
    </section>
  );
}
