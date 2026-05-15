"use client";

import { useCallback, useState } from 'react';
import type { GameAwardHandler } from '../../game-award';
import { GameCoinPill } from '../../game-coin-pill';
import { GameExitConfirmDialog } from '../../game-exit-confirm-dialog';
import { useSliceMasterEngine } from './use-slice-master-engine';
import type { LocalGameRendererProps } from '../local-game-renderer';

export function SliceMasterGame({
  onAward,
  coins = 0,
}: LocalGameRendererProps) {
  const handleAward: GameAwardHandler = useCallback(
    (payload) => {
      onAward(payload);
    },
    [onAward],
  );

  const { canvasRef, status, score, restartGame } = useSliceMasterEngine({
    onAward: handleAward,
  });

  const [showExitDialog, setShowExitDialog] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-amber-50">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
      />

      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <GameCoinPill coins={coins} />
      </div>

      <GameExitConfirmDialog
        open={showExitDialog}
        onCancel={() => setShowExitDialog(false)}
        onConfirm={() => setShowExitDialog(false)}
      />

      {status === 'finished' && (
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-6">
          <div className="text-center">
            <p className="text-2xl font-black text-white drop-shadow-lg">
              {score} Score
            </p>
          </div>
          <button
            type="button"
            onClick={restartGame}
            className="pointer-events-auto rounded-xl bg-amber-500 px-8 py-3 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}

      {status === 'running' && (
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs font-bold text-amber-700 opacity-60">
            Swipe or drag to slice the food!
          </p>
        </div>
      )}
    </div>
  );
}
