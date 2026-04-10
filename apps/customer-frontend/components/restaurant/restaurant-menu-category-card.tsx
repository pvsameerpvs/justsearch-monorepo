import { Sparkles } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { MenuCategory } from '@/lib/restaurant-types';
import { RestaurantMenuSubcategorySection } from './restaurant-menu-subcategory-section';

type RestaurantMenuCategoryCardProps = {
  category: MenuCategory;
};

export function RestaurantMenuCategoryCard({
  category,
}: RestaurantMenuCategoryCardProps) {
  const groupedItems = Object.entries(
    category.items.reduce<Record<string, typeof category.items>>((groups, item) => {
      const key = item.subcategory ?? 'Chef Selection';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {})
  );

  return (
    <section id={category.id} className="scroll-mt-24">
      <Surface className="rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[rgba(var(--card-surface),0.88)] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
              {category.emoji ? `${category.emoji} Category` : 'Category'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))] sm:text-[2.5rem]">
              {category.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgb(var(--muted))] sm:text-base">
              {category.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(var(--brand-soft),0.75)]">
              <Sparkles className="h-5 w-5 text-[rgb(var(--brand))]" />
            </div>
            <div className="rounded-[24px] border border-[rgba(var(--border),0.76)] bg-[rgba(var(--card-surface-muted),0.9)] px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                Dishes
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                {category.items.length}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-8">
          {groupedItems.map(([title, items]) => (
            <RestaurantMenuSubcategorySection
              key={title}
              title={title}
              items={items}
            />
          ))}
        </div>
      </Surface>
    </section>
  );
}
