import { Check, Clock3 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { MenuItem } from '@/lib/restaurant-types';
import type { ViewMode } from './restaurant-menu-showcase';

type RestaurantMenuItemCardProps = {
  item: MenuItem;
  viewMode?: ViewMode;
};

export function RestaurantMenuItemCard({
  item,
  viewMode = 'grid',
}: RestaurantMenuItemCardProps) {
  const isList = viewMode === 'list';
  
  const imageBackground = item.image
    ? `linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.28)), url(${item.image})`
    : 'linear-gradient(135deg, rgba(var(--brand-soft), 0.96), rgba(var(--accent-soft), 0.88))';

  return (
    <article className={`overflow-hidden rounded-[24px] border border-[rgba(var(--border),0.7)] bg-[rgba(var(--card-surface-muted),0.92)] shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_18px_44px_rgba(15,23,42,0.06)] ${
      isList ? 'flex flex-col sm:flex-row' : ''
    }`}>
      {/* Image Section */}
      <div
        role="img"
        aria-label={`${item.name} presentation`}
        className={`relative bg-cover bg-center shrink-0 ${
          isList ? 'aspect-video w-full sm:aspect-[4/3] sm:w-[240px]' : 'aspect-[4/3] w-full'
        }`}
        style={{
          backgroundImage: imageBackground,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.2))]" />
        
        {/* Tags on Image */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/22 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[rgb(var(--ink))]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price on Image (Grid only) */}
        {!isList && (
          <div className="absolute bottom-4 right-4 rounded-full bg-[rgb(var(--surface))] px-4 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.15)]">
            <p className="font-display text-lg font-bold tracking-tight text-[rgb(var(--ink))]">
              {formatCurrency(item.price, item.currency)}
            </p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`flex flex-1 flex-col justify-between p-5 sm:p-6 ${isList ? 'sm:py-5' : ''}`}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                <h3 className="font-display text-xl font-bold tracking-tight text-[rgb(var(--ink))] sm:text-2xl">
                  {item.name}
                </h3>
                {isList && (
                   <span className="font-display text-lg font-bold tracking-tight text-[rgb(var(--brand))]">
                    {formatCurrency(item.price, item.currency)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[rgb(var(--muted))] line-clamp-2 sm:line-clamp-none">
                {item.description}
              </p>
            </div>

            {!isList && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
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
            )}
          </div>
        </div>

        {/* Footer info (List only) */}
        {isList && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                item.isAvailable
                  ? 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]'
                  : 'bg-[rgba(var(--border),0.78)] text-[rgb(var(--muted))]'
              }`}
            >
              {item.isAvailable ? (
                <Check className="h-3 w-3" />
              ) : (
                <Clock3 className="h-3 w-3" />
              )}
              {item.isAvailable ? 'Available' : 'Limited'}
            </span>
            
            <button className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] hover:underline">
              View Details
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
