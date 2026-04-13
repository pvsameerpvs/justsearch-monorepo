"use client";

import type { LocalGameRendererProps } from '../local-game-renderer';
import { useVexRunnerEngine } from './use-vex-runner-engine';

export function VexRunnerGame({ game, onAward }: LocalGameRendererProps) {
  const { canvasRef, status, jump, restartGame } = useVexRunnerEngine({
    onAward,
    playerFoodItem: game.playerFoodItem ?? 'burger',
  });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onPointerDown={jump}
        className="absolute inset-0 h-full w-full cursor-pointer touch-none select-none bg-[#0f172a]"
      />

      {status === 'finished' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+22px)] z-20 flex justify-center px-4">
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
