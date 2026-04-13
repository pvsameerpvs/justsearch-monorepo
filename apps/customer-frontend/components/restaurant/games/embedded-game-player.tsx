"use client";

import type { EmbedGame } from '@/lib/restaurant-types';

type EmbeddedGamePlayerProps = {
  game: EmbedGame;
};

export function EmbeddedGamePlayer({ game }: EmbeddedGamePlayerProps) {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <iframe
        src={game.embedUrl}
        title={game.name}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
