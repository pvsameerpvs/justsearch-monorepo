import { AdOverlay } from '@/components/restaurant/games/ad-overlay';

interface GameAdOverlaysProps {
  showAdOnGameEnd: boolean;
  showAdOnBack: boolean;
  restaurantId: string;
  gameId: string;
  onGameEndComplete: () => void;
  onGameEndSkip: () => void;
  onBackComplete: () => void;
  onBackSkip: () => void;
}

export function GameAdOverlays({
  showAdOnGameEnd, showAdOnBack, restaurantId, gameId,
  onGameEndComplete, onGameEndSkip, onBackComplete, onBackSkip,
}: GameAdOverlaysProps) {
  return (
    <>
      {showAdOnGameEnd && (
        <AdOverlay onComplete={onGameEndComplete} onSkip={onGameEndSkip} restaurantId={restaurantId} gameId={gameId} completeLabel="Continue" />
      )}
      {showAdOnBack && (
        <AdOverlay onComplete={onBackComplete} onSkip={onBackSkip} restaurantId={restaurantId} gameId={gameId} completeLabel="Continue" />
      )}
    </>
  );
}
