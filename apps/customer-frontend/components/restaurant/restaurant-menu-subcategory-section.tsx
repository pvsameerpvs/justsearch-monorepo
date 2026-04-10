import type { MenuItem } from '@/lib/restaurant-types';
import { RestaurantMenuItemCard } from './restaurant-menu-item-card';
import type { ViewMode } from './restaurant-menu-showcase';

type RestaurantMenuSubcategorySectionProps = {
  title: string;
  items: MenuItem[];
  viewMode?: ViewMode;
};

export function RestaurantMenuSubcategorySection({
  title,
  items,
  viewMode = 'grid',
}: RestaurantMenuSubcategorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
            Subcategory
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))] sm:text-[2rem]">
            {title}
          </h3>
        </div>
        <p className="text-sm font-medium text-[rgb(var(--muted))]">
          {items.length} item{items.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className={
        viewMode === 'list' 
          ? 'space-y-4' 
          : 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
      }>
        {items.map((item) => (
          <RestaurantMenuItemCard key={item.id} item={item} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
