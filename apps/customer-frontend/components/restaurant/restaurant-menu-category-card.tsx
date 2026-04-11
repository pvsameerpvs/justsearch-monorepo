import { Surface } from '@/components/shared/surface';
import type { MenuCategory } from '@/lib/restaurant-types';
import { RestaurantMenuSubcategorySection } from './restaurant-menu-subcategory-section';
import type { ViewMode } from './restaurant-menu-showcase';

type RestaurantMenuCategoryCardProps = {
  category: MenuCategory;
  viewMode: ViewMode;
};

export function RestaurantMenuCategoryCard({
  category,
  viewMode,
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
      <Surface className="rounded-[14px] border-[rgb(var(--card-border)/0.9)] bg-[rgb(var(--card-surface)/0.88)] p-6 sm:p-8">
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
          
        </div>
        <div className="mt-8 space-y-8">
          {groupedItems.map(([title, items]) => (
            <RestaurantMenuSubcategorySection
              key={title}
              title={title}
              items={items}
              viewMode={viewMode}
            />
          ))}
        </div>
      </Surface>
    </section>
  );
}
