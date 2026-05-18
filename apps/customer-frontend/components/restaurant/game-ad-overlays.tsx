import { AdOverlay } from '@/components/restaurant/games/ad/ad-overlay';

interface GameAdOverlaysProps {
  showAdOnGameEnd: boolean;
  showAdOnBack: boolean;
  restaurantId: string;
  gameId: string;
  onGameEndComplete: () => void;
  onBackComplete: () => void;
}

export function GameAdOverlays({
  showAdOnGameEnd, showAdOnBack, restaurantId, gameId,
  onGameEndComplete, onBackComplete,
}: GameAdOverlaysProps) {
  return (
    <>
      {showAdOnGameEnd && (
        <AdOverlay onComplete={onGameEndComplete} restaurantId={restaurantId} gameId={gameId} completeLabel="Continue" />
      )}
      {showAdOnBack && (
        <AdOverlay onComplete={onBackComplete} restaurantId={restaurantId} gameId={gameId} completeLabel="Continue" />
      )}
    </>
  );
}
