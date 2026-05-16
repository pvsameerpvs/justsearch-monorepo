import { ArrowLeft } from 'lucide-react';
import { GameCoinPill } from '@/components/restaurant/games/game-coin-pill';

interface GameHeaderProps {
  onBack: () => void;
  coins: number;
}

export function GameHeader({ onBack, coins }: GameHeaderProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] sm:px-6">
      <button type="button" onClick={onBack} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/22 text-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all hover:bg-white/30 active:scale-95" aria-label="Back to games">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <GameCoinPill coins={coins} />
    </div>
  );
}
