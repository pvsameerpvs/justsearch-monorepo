import { Check, Clock3 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { MenuItem } from '@/lib/restaurant-types';

type RestaurantMenuItemCardProps = {
  item: MenuItem;
};

export function RestaurantMenuItemCard({
  item,
}: RestaurantMenuItemCardProps) {
  const imageBackground = item.image
    ? `linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.28)), url(${item.image})`
    : 'linear-gradient(135deg, rgba(var(--brand-soft), 0.96), rgba(var(--accent-soft), 0.88))';

  return (
    <article className="overflow-hidden rounded-[28px] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--card-surface-muted),0.92)] shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
      <div
        role="img"
        aria-label={`${item.name} presentation`}
        className="relative aspect-[4/3] bg-cover bg-center"
        style={{
          backgroundImage: imageBackground,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.2))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/22 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--ink))]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-[rgb(var(--surface))] px-4 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.15)]">
          <p className="font-display text-lg font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {formatCurrency(item.price, item.currency)}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
              {item.name}
            </h3>
            <p className="text-sm leading-6 text-[rgb(var(--muted))]">
              {item.description}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
              item.isAvailable
                ? 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]'
                : 'bg-[rgba(var(--border),0.78)] text-[rgb(var(--muted))]'
            }`}
          >
            {item.isAvailable ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Clock3 className="h-3.5 w-3.5" />
            )}
            {item.isAvailable ? 'Available' : 'Limited'}
          </span>
        </div>
      </div>
    </article>
  );
}
