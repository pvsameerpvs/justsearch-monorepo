"use client";

import { useCallback, useMemo, useState } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Game, Restaurant } from '@/lib/restaurant-types';
import { QuickQuizCanvasGame } from './games/quick-quiz-canvas-game';
import { ScratchCardCanvasGame } from './games/scratch-card-canvas-game';
import { SpinWheelCanvasGame } from './games/spin-wheel-canvas-game';
import { TapChallengeCanvasGame } from './games/tap-challenge-canvas-game';
import type { GameAwardResult } from './games/game-award';
import { useLoyaltyPoints } from './use-loyalty-points';

type RestaurantGameScreenProps = {
  restaurant: Restaurant;
  game: Game;
};

export function RestaurantGameScreen({ restaurant, game }: RestaurantGameScreenProps) {
  const { points, addPoints } = useLoyaltyPoints();
  const subtitle = useMemo(() => {
    if (game.accessLevel === 'public') return 'Public game';
    if (game.accessLevel === 'login_required') return 'Login required (demo mode)';
    return 'Session required (demo mode)';
  }, [game.accessLevel]);

  const [lastAward, setLastAward] = useState<GameAwardResult | null>(null);

  const onAward = useCallback(
    (result: GameAwardResult) => {
      setLastAward(result);
      addPoints(result.points);
    },
    [addPoints],
  );

  const gameBody = useMemo(() => {
    switch (game.id) {
      case 'spin-wheel':
        return <SpinWheelCanvasGame onAward={onAward} />;
      case 'scratch-card':
        return <ScratchCardCanvasGame onAward={onAward} />;
      case 'tap-challenge':
        return <TapChallengeCanvasGame onAward={onAward} />;
      case 'quick-quiz':
        return <QuickQuizCanvasGame onAward={onAward} />;
      default:
        return (
          <div className="rounded-[28px] border border-[rgba(var(--card-border),0.9)] bg-white/80 p-6 text-center">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">
              This game is not wired up yet.
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Game id: <span className="font-mono">{game.id}</span>
            </p>
          </div>
        );
    }
  }, [game.id, onAward]);

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-6">
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
    </section>
  );
}
