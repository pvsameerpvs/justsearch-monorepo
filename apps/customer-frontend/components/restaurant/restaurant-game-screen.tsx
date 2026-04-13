"use client";

import { useCallback, useMemo, useState } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Game, Restaurant } from '@/lib/restaurant-types';
import type { GameAwardResult } from './games/game-award';
import { RunnerCanvasGame } from './games/runner-canvas-game';
import { useRegistration } from '@/components/auth/registration-context';
import { useLoyaltyPoints } from './use-loyalty-points';
import { useUserGameStats } from './use-user-game-stats';

type RestaurantGameScreenProps = {
  restaurant: Restaurant;
  game: Game;
};

function getAccessSubtitle(accessLevel: Game['accessLevel']) {
  if (accessLevel === 'public') return 'Public game';
  if (accessLevel === 'login_required') return 'Login required (demo mode)';
  return 'Session required (demo mode)';
}

export function RestaurantGameScreen({
  restaurant,
  game,
}: RestaurantGameScreenProps) {
  const { isRegistered, openModal } = useRegistration();
  const { points, addPoints } = useLoyaltyPoints();
  const { updateGameStat, getGameStat } = useUserGameStats();
  const [lastAward, setLastAward] = useState<GameAwardResult | null>(null);

  const subtitle = useMemo(
    () => getAccessSubtitle(game.accessLevel),
    [game.accessLevel],
  );

  const stats = useMemo(() => getGameStat(game.id), [getGameStat, game.id]);

  const onAward = useCallback(
    (result: GameAwardResult) => {
      setLastAward(result);
      addPoints(result.points);
      updateGameStat(game.id, result.score, result.level);
    },
    [addPoints, game.id, updateGameStat],
  );

  const gameBody = useMemo(() => {
    if (!isRegistered) {
      return (
        <div className="rounded-[28px] border border-[rgb(var(--card-border)/0.9)] bg-white/80 p-6 text-center">
          <p className="text-sm font-semibold text-[rgb(var(--ink))]">
            Registration required
          </p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Verify your mobile number to play games and save scores.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-6 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.22)] transition-all hover:brightness-110 active:scale-[0.99]"
          >
            Register now
          </button>
        </div>
      );
    }

    if (game.id === 'vex-runner') return <RunnerCanvasGame onAward={onAward} />;

    return (
      <div className="rounded-[28px] border border-[rgb(var(--card-border)/0.9)] bg-white/80 p-6 text-center">
        <p className="text-sm font-semibold text-[rgb(var(--ink))]">
          This game is not wired up yet.
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Game id: <span className="font-mono">{game.id}</span>
        </p>
      </div>
    );
  }, [game.id, onAward, isRegistered, openModal]);

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-6">
          <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(140deg,rgb(var(--brand-soft)/0.25),rgba(255,255,255,0.92),rgb(var(--accent-soft)/0.38))] p-6 sm:p-8">
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
                {stats.roundsPlayed > 0 ? (
                  <div className="text-[rgb(var(--muted))]">
                    Best: {stats.highScore} • Rounds: {stats.roundsPlayed}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6">{gameBody}</div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}
