"use client";

import type { LocalGameRendererProps } from '../local-game-renderer';
import { useHungryBirdRushEngine } from './use-hungry-bird-rush-engine';

export function HungryBirdRushGame({ game, onAward }: LocalGameRendererProps) {
  const { canvasRef, status, score, isTopScorer, flap, restartGame } = useHungryBirdRushEngine({
    onAward,
    topScoreToBeat: game.communityTopScore,
  });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onPointerDown={flap}
        className="absolute inset-0 h-full w-full cursor-pointer touch-none select-none bg-[#0f172a]"
      />

      {status !== 'finished' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+22px)] z-20 flex justify-center px-4">
          <p className="inline-flex min-h-9 items-center rounded-full border border-white/40 bg-black/28 px-5 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-sm">
            Score: {score}
          </p>
        </div>
      ) : null}

      {status === 'finished' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+22px)] z-20 flex flex-col items-center gap-3 px-4">
          {isTopScorer ? (
            <p className="inline-flex min-h-10 items-center rounded-full border border-yellow-200/80 bg-yellow-300/20 px-5 text-center text-xs font-semibold tracking-[0.12em] text-yellow-100 shadow-[0_14px_30px_rgba(250,204,21,0.2)] backdrop-blur-sm">
              You are the Top Scorer!
            </p>
          ) : null}
          <p className="inline-flex min-h-9 items-center rounded-full border border-white/40 bg-white/16 px-4 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_12px_26px_rgba(15,23,42,0.24)] backdrop-blur-sm">
            Final Score: {score}
          </p>
          <button
            type="button"
            onClick={restartGame}
            className="pointer-events-auto inline-flex h-12 items-center justify-center rounded-full border border-white/75 bg-[linear-gradient(180deg,#fff6d9,#ffe071)] px-10 text-sm font-semibold tracking-[0.08em] text-[#755000] shadow-[0_14px_30px_rgba(255,211,95,0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Replay
          </button>
        </div>
      ) : null}
    </div>
  );
}
