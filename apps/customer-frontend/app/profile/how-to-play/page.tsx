import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { ButtonLink } from '@/components/shared/button-link';
import { HOW_TO_PLAY_GAMES } from '@/lib/constants/how-to-play.constants';

export default function ProfileHowToPlayPage() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              How to play
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
              Game rules
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Choose a game and follow the simple steps below.
            </p>
          </Surface>

          <div className="grid gap-4">
            {HOW_TO_PLAY_GAMES.map((game) => (
              <Surface
                key={game.title}
                className="rounded-[28px] border-white/70 bg-white/90 p-6"
              >
                <p className="font-display text-xl font-semibold text-[rgb(var(--ink))]">
                  {game.title}
                </p>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[rgb(var(--muted))]">
                  {game.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Surface>
            ))}
          </div>

          <div className="flex justify-center">
            <ButtonLink href="/eat-play" variant="primary" size="md">
              Play now
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

