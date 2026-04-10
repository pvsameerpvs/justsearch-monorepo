import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantMenuCategoryCard } from './restaurant-menu-category-card';
import { RestaurantMenuHero } from './restaurant-menu-hero';

type RestaurantMenuShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantMenuShowcase({
  restaurant,
}: RestaurantMenuShowcaseProps) {
  const allItems = restaurant.menu.flatMap((category) => category.items);
  const availableItems = allItems.filter((item) => item.isAvailable);
  const priceValues = allItems.map((item) => item.price);
  const currency = allItems[0]?.currency ?? 'AED';
  const lowestPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;

  return (
    <>
      <RestaurantMenuHero
        restaurant={restaurant}
        itemCount={allItems.length}
        lowestPrice={lowestPrice}
        currency={currency}
      />

      <section className="relative -mt-10 pb-20 sm:pb-24 lg:pb-32">
        <Container>
          {/* Category Navigation Bar */}
          <div className="sticky top-4 z-40 mb-12 flex flex-col gap-6 rounded-[32px] border border-white/80 bg-white/60 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[rgb(var(--brand))]">
                  Menu Selection
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[rgb(var(--ink))]">
                  Explore Categories
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {availableItems.length} Available for order
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {restaurant.menu.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="group relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:border-[rgb(var(--brand))] hover:text-[rgb(var(--brand))] hover:shadow-lg hover:shadow-[rgb(var(--brand)/0.1)] active:scale-95"
                >
                  <span className="text-lg transition-transform group-hover:scale-125">{category.emoji}</span>
                  {category.title}
                </a>
              ))}
            </div>
          </div>

          {/* Menu Sections */}
          <div className="space-y-16 sm:space-y-24">
            {restaurant.menu.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-32">
                <RestaurantMenuCategoryCard category={category} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
