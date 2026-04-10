import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantGamePreviewCard } from './restaurant-game-preview-card';

type RestaurantEatPlayShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantEatPlayShowcase({
  restaurant,
}: RestaurantEatPlayShowcaseProps) {
  const availableGames = restaurant.games.filter((game) => game.isAvailable);

  return (
    <>
      <section className="pt-8 pb-14 sm:pt-10 sm:pb-16">
        <Container>
          {availableGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {availableGames.map((game) => (
                <RestaurantGamePreviewCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No games available yet"
              description="This restaurant has not enabled any games. Check back soon."
              action={
                <ButtonLink href="/menu" variant="primary" size="md">
                  View menu
                </ButtonLink>
              }
            />
          )}
        </Container>
      </section>
    </>
  );
}
