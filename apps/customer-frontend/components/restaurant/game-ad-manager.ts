import { useCallback, useState } from 'react';
import { submitScore } from '@/components/restaurant/games/use-submit-score';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { useUserGameStats } from '@/components/restaurant/use-user-game-stats';
import type { GameAwardResult } from '@/components/restaurant/games/game-award';

export function useGameAdManager(gameId: string) {
  const { addPoints } = useLoyaltyPoints();
  const { updateGameStat } = useUserGameStats();
  const [showAdOnGameEnd, setShowAdOnGameEnd] = useState(false);
  const [showAdOnBack, setShowAdOnBack] = useState(false);
  const [pendingAward, setPendingAward] = useState<GameAwardResult | null>(null);

  const processAward = useCallback(
    async (result: GameAwardResult) => {
      const { pointsAwarded } = await submitScore(gameId, result.score, result.level);
      addPoints(pointsAwarded);
      updateGameStat(gameId, result.score, pointsAwarded, result.level);
    },
    [addPoints, gameId, updateGameStat],
  );

  const onAward = useCallback((result: GameAwardResult) => {
    setPendingAward(result);
    setShowAdOnGameEnd(true);
  }, []);

  const handleGameEndAdComplete = useCallback(async () => {
    setShowAdOnGameEnd(false);
    if (pendingAward) { await processAward(pendingAward); setPendingAward(null); }
  }, [pendingAward, processAward]);

  const handleGameEndAdSkip = useCallback(async () => {
    setShowAdOnGameEnd(false);
    if (pendingAward) { await processAward(pendingAward); setPendingAward(null); }
  }, [pendingAward, processAward]);

  const handleBackAdComplete = useCallback(() => {
    setShowAdOnBack(false);
    return true;
  }, []);

  const handleBackAdSkip = useCallback(() => {
    setShowAdOnBack(false);
    return true;
  }, []);

  return {
    showAdOnGameEnd, showAdOnBack, setShowAdOnBack, pendingAward,
    onAward, handleGameEndAdComplete, handleGameEndAdSkip, handleBackAdComplete, handleBackAdSkip,
  };
}
