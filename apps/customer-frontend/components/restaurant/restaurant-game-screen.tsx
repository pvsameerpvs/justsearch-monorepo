"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Game, Restaurant } from '@/lib/restaurant-types';
import { ScratchCardCanvasGame } from './games/scratch-card-canvas-game';
import { SpinWheelCanvasGame } from './games/spin-wheel-canvas-game';
import { EmbeddedIframeGame } from './games/embedded-iframe-game';
import type { GameAwardResult } from './games/game-award';
import { useLoyaltyPoints } from './use-loyalty-points';
import { useUserGameStats } from './use-user-game-stats';

type RestaurantGameScreenProps = {
  restaurant: Restaurant;
  game: Game;
};

export function RestaurantGameScreen({ restaurant, game }: RestaurantGameScreenProps) {
  const { points, addPoints } = useLoyaltyPoints();
  const { updateGameStat, getGameStat } = useUserGameStats();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.warn("Component mounted and ready for interaction.");
  }, []);

  const currentStats = useMemo(() => getGameStat(game.id), [getGameStat, game.id]);

  const subtitle = useMemo(() => {
    if (game.accessLevel === 'public') return 'Public game';
    if (game.accessLevel === 'login_required') return 'Login required (demo mode)';
    return 'Session required (demo mode)';
  }, [game.accessLevel]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAward, setLastAward] = useState<GameAwardResult | null>(null);

  const onAward = useCallback(
    (result: GameAwardResult) => {
      setLastAward(result);
      addPoints(result.points);
      // PERSIST SCORE AND LEVEL
      updateGameStat(game.id, result.score, result.level);
    },
    [addPoints, updateGameStat, game.id],
  );

  const gameBody = useMemo(() => {
    switch (game.id) {
      case 'spin-wheel':
        return <SpinWheelCanvasGame onAward={onAward} />;
      case 'scratch-card':
        return <ScratchCardCanvasGame onAward={onAward} />;
      default:
        // Handle all dynamic Vex/External games using embedId
        if (game.embedId) {
          return (
            <EmbeddedIframeGame 
              onAward={onAward} 
              gameUrl={`https://html5.gamedistribution.com/${game.embedId}/?gd_sdk_referrer_url=https://justsearch.io`} 
            />
          );
        }
        return (
          <div className="rounded-[28px] border border-[rgba(var(--card-border),0.9)] bg-white/80 p-6 text-center">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">
              This game is not wired up yet.
            </p>
          </div>
        );
    }
  }, [game.id, onAward]);

  // CONSOLIDATED UI
  return (

    <>
      {/* MOBILE FULLSCREEN GAME OVERLAY - TOP LEVEL SIBLING */}
      {isPlaying && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-black lg:hidden">
            <div className="absolute left-4 top-4 z-[100000]">
                <button 
                    onClick={() => {
                        console.log("Closing game...");
                        setIsPlaying(false);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 active:scale-90 transition-transform"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="h-full w-full">
                {game.id.includes('vex') && !game.embedId ? (
                    <div className="flex h-full items-center justify-center p-10 text-center text-white">
                        <p className="font-bold underline">Error: Game Embed ID Missing.</p>
                    </div>
                ) : gameBody}
            </div>
        </div>
      )}

      {/* MAIN SCREEN CONTENT */}
      <div className="fixed inset-0 z-[10000] flex flex-col bg-[linear-gradient(135deg,#0f172a,#2d1b4e,#4c1d35)] lg:relative lg:inset-auto lg:z-0 lg:block lg:bg-transparent lg:py-10">
        <div className="flex-1 overflow-y-auto lg:flex-none">
            <Container className="h-full">
                {/* MOBILE SPLASH SCREEN UI */}
                <div className="flex min-h-full flex-col p-6 lg:hidden">
                    {/* Top Bar with Points */}
                    <div className="flex items-center justify-between pb-4">
                        <ButtonLink 
                            href="/eat-play" 
                            variant="secondary" 
                            className="!h-10 !w-10 !rounded-full !p-0 !bg-white/5 !text-white !border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-lg"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </ButtonLink>
                        
                        <div className="flex h-10 items-center gap-2 rounded-full bg-white/5 px-4 text-sm font-black text-white backdrop-blur-3xl border border-white/10 shadow-lg">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                <span className="text-[10px] text-yellow-900 leading-none">★</span>
                            </div>
                            <span className="tracking-tight">{points}</span>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                        <div className="relative mb-10">
                            <div className="absolute -inset-10 animate-pulse rounded-full bg-indigo-500/20 blur-3xl"></div>
                            <div className="absolute -inset-10 animate-pulse delay-700 rounded-full bg-pink-500/10 blur-3xl"></div>
                            
                            <div className="relative overflow-hidden rounded-[44px] border border-white/20 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
                                <div className="flex h-48 w-48 items-center justify-center rounded-[36px] bg-gradient-to-br from-white/10 via-white/5 to-transparent text-8xl shadow-inner">
                                    <span className="drop-shadow-2xl">{game.icon}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <button 
                                onClick={() => {
                                    console.log("Starting game: " + game.name);
                                    setIsPlaying(true);
                                }}
                                onTouchEnd={() => {
                                    console.log("Touch starting game: " + game.name);
                                    setIsPlaying(true);
                                }}
                                className="group relative flex h-22 w-48 items-center justify-center overflow-hidden rounded-[30px] bg-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.4),0_8px_0_#cbd5e1] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                            >
                                <span className="relative z-10 text-4xl font-black italic tracking-tighter text-[#1e293b]">START</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </div>

                        <div className="relative">
                            <h2 className="mb-3 text-4xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl">
                                {game.name}
                            </h2>

                            {mounted && currentStats.roundsPlayed > 0 && (
                                <div className="mx-auto mb-6 flex max-w-[240px] items-center gap-4 rounded-2xl bg-white/5 p-2 backdrop-blur-md border border-white/10">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Best Score</p>
                                        <p className="font-black text-white">{currentStats.highScore}</p>
                                    </div>
                                    <div className="h-8 w-px bg-white/10"></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Reached</p>
                                        <p className="font-black text-white">LVL {currentStats.maxLevel}</p>
                                    </div>
                                </div>
                            )}

                            <p className="max-w-[280px] text-base font-medium leading-relaxed text-white/70 subpixel-antialiased">
                                {game.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 py-4 opacity-40">
                         <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                         <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Just Search</div>
                         <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                    </div>
                </div>

                <div className="hidden lg:flex lg:flex-col lg:gap-6 lg:py-10">
                    <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(140deg,rgba(var(--brand-soft),0.25),rgba(var(--card-surface),0.92),rgba(var(--accent-soft),0.38))] p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
                            {subtitle}
                            </p>
                            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))] sm:text-4xl">
                            {game.icon} {game.name}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
                            {game.description}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <ButtonLink href="/eat-play" variant="secondary" size="md">
                            Back
                            </ButtonLink>
                        </div>
                        </div>
                    </Surface>

                    <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
                            Score
                            </p>
                            {lastAward ? (
                            <p className="mt-2 text-sm font-semibold text-[rgb(var(--ink))]">
                                {lastAward.label}: score {lastAward.score} • +{lastAward.points} points
                            </p>
                            ) : (
                            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                                Play a round to generate a score.
                            </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 text-sm font-semibold text-[rgb(var(--muted))] sm:items-end">
                            <div>Restaurant: {restaurant.name}</div>
                            <div className="text-[rgb(var(--ink))]">Your points: {points}</div>
                        </div>
                        </div>

                        <div className="mt-6">{gameBody}</div>
                    </Surface>
                </div>
            </Container>
        </div>
      </div>
    </>
  );
}

