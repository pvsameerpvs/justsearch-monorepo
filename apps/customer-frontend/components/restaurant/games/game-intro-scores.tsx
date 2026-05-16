"use client";

export function GameIntroScores({
  hasPlayed,
  lastScore,
  highScore,
  communityTopScore,
}: {
  hasPlayed: boolean;
  lastScore: number;
  highScore: number;
  communityTopScore?: number;
}) {
  if (!hasPlayed && typeof communityTopScore !== 'number') return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {typeof communityTopScore === 'number' ? (
        <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
          Top Score: {communityTopScore.toLocaleString()}
        </p>
      ) : null}
      <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
        Last Score: {lastScore}
      </p>
      <p className="inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/18 px-3 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(5,36,46,0.22)] backdrop-blur-sm">
        Best: {highScore}
      </p>
    </div>
  );
}
