import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { ButtonLink } from '@/components/shared/button-link';
import { demoRestaurant } from '@/lib/demo-data';
import { GameCard } from './game-card';

export function GameLobby() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Games"
            title="A game lobby that shows exactly what is unlocked."
            description="Customers should always see why a game is available or blocked, with the session state visible at all times."
            action={<ButtonLink href="/live" variant="secondary">Refresh session</ButtonLink>}
          />

          <div className="grid gap-6 md:grid-cols-2">
            {demoRestaurant.games.map((game) => (
              <GameCard key={game.name} {...game} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

