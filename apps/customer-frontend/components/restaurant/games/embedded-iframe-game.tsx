"use client";

import { useEffect, useState } from 'react';
import type { GameAwardHandler } from './game-award';

type EmbeddedIframeGameProps = {
  onAward: GameAwardHandler;
  gameUrl: string; // The URL of the hosted WebGL game (e.g. Unity output)
};

export function EmbeddedIframeGame({ onAward, gameUrl }: EmbeddedIframeGameProps) {
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    // 1. We set up an event listener to listen for messages from the embedded iframe
    const handleMessage = (event: MessageEvent) => {
      // Security check: In production, verify event.origin to ensure it's from a trusted game server!
      
      const data = event.data;
      
      // 2. Look for the specific message the game sends when it ends
      if (data && data.type === 'WEBGL_GAME_OVER' && !hasFinished) {
        setHasFinished(true);
        const finalScore = data.score || 0;
        const finalLevel = data.level || 1;
        const pointsAwarded = Math.min(Math.floor(finalScore / 2), 1500); 

        onAward({
          points: pointsAwarded,
          score: finalScore,
          level: finalLevel,
          label: '3D Pro Game',
        });
      }

      // 4. Handle game restart signal from the iframe
      if (data && data.type === 'WEBGL_GAME_START') {
        setHasFinished(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAward, hasFinished]);

  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-hidden bg-black lg:max-w-[800px] lg:rounded-[32px] lg:border lg:border-[rgba(var(--card-border),0.9)] lg:shadow-xl">
      <iframe
        src={gameUrl}
        title="Professional 3D WebGL Game"
        className="h-full w-full border-none outline-none lg:h-[600px]"
        style={{ minHeight: '100%' }}
        sandbox="allow-scripts allow-same-origin"
      />
      
      <div className="hidden bg-white/5 p-3 text-center lg:block">
        <p className="text-[10px] font-medium text-[rgb(var(--muted))] lg:text-xs">
          Professional WebGL Engine. Play above to sync points to your account.
        </p>
      </div>
    </div>
  );
}
