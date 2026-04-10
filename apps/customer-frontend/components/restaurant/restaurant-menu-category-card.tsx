import { Sparkles } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { formatCurrency } from '@/lib/format';
import type { MenuCategory } from '@/lib/restaurant-types';

type RestaurantMenuCategoryCardProps = {
  category: MenuCategory;
};

export function RestaurantMenuCategoryCard({
  category,
}: RestaurantMenuCategoryCardProps) {
  return (
    <Surface className="rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[rgba(var(--card-surface),0.88)] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
            {category.emoji ? `${category.emoji} Category` : 'Category'}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {category.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
            {category.description}
          </p>
        </div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(var(--brand-soft),0.75)]">
          <Sparkles className="h-5 w-5 text-[rgb(var(--brand))]" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {category.items.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-[rgba(var(--border),0.72)] bg-[rgba(var(--card-surface-muted),0.88)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[rgb(var(--ink))]">
                    {item.name}
                  </h3>
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgb(var(--brand-soft))] bg-[rgb(var(--brand-soft))] px-2.5 py-1 text-xs font-semibold text-[rgb(var(--brand))]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                  {item.description}
                </p>
              </div>
              <p className="font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                {formatCurrency(item.price, item.currency)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
