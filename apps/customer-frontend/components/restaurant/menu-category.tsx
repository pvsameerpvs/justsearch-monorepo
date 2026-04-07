import { MenuItemCard } from './menu-item';
import { Surface } from '@/components/shared/surface';
import type { MenuCategory } from '@/lib/demo-data';

type MenuCategoryCardProps = MenuCategory & {
  compact?: boolean;
};

export function MenuCategoryCard({ title, description, items, compact = false }: MenuCategoryCardProps) {
  const visibleItems = compact ? items.slice(0, 2) : items;

  return (
    <Surface className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
            Menu category
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="grid gap-4">
          {visibleItems.map((item) => (
            <MenuItemCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </Surface>
  );
}

