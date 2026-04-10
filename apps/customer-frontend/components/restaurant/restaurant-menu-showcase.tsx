import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { formatCurrency } from '@/lib/format';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantMenuCategoryCard } from './restaurant-menu-category-card';
import { RestaurantPageHero } from './restaurant-page-hero';

type RestaurantMenuShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantMenuShowcase({
  restaurant,
}: RestaurantMenuShowcaseProps) {
  const allItems = restaurant.menu.flatMap((category) => category.items);
  const priceValues = allItems.map((item) => item.price);
  const currency = allItems[0]?.currency ?? 'AED';
  const lowestPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const highestPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

  return (
    <>
      <RestaurantPageHero
        restaurant={restaurant}
        eyebrow="Food menu"
        title="A menu page that changes with each restaurant."
        description="Each restaurant can plug in its own categories, dish names, pricing, and hero copy while keeping the same clean page layout."
        stats={[
          { label: 'Categories', value: String(restaurant.menu.length) },
          { label: 'Dishes', value: String(allItems.length) },
          {
            label: 'Price range',
            value: `${formatCurrency(lowestPrice, currency)} - ${formatCurrency(highestPrice, currency)}`,
          },
        ]}
        action={
          <>
            <ButtonLink href="/social-media" variant="primary" size="md">
              Social media
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="md">
              Back to home
            </ButtonLink>
          </>
        }
      />

      <section className="pb-14 sm:pb-16">
        <Container>
          <div className="mb-6 flex flex-wrap gap-2">
            {restaurant.cuisine.map((cuisine) => (
              <span
                key={cuisine}
                className="rounded-full border border-[rgba(var(--card-border),0.86)] bg-[rgba(var(--card-surface),0.76)] px-4 py-2 text-sm font-medium text-[rgb(var(--muted))]"
              >
                {cuisine}
              </span>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {restaurant.menu.map((category) => (
              <RestaurantMenuCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
