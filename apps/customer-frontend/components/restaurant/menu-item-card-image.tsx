import { formatCurrency } from '@/lib/format';
import type { MenuItem } from '@/lib/restaurant-types';

interface MenuItemImageProps {
  item: MenuItem;
  isList: boolean;
}

export function MenuItemImage({ item, isList }: MenuItemImageProps) {
  const bg = item.image
    ? `linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.28)), url(${item.image})`
    : 'linear-gradient(135deg, rgb(var(--brand-soft) / 0.96), rgb(var(--accent-soft) / 0.88))';

  return (
    <div
      role="img"
      aria-label={`${item.name} presentation`}
      className={`relative bg-cover bg-center shrink-0 ${isList ? 'w-[100px] sm:w-[240px] sm:aspect-[4/3]' : 'aspect-[4/3] w-full'}`}
      style={{ backgroundImage: bg }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.2))]" />
      <div className={`absolute left-4 top-4 flex flex-wrap gap-2 ${isList ? 'hidden sm:flex' : 'flex'}`}>
        {item.tags?.map((tag) => (
          <span key={tag} className="rounded-full border border-white/22 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[rgb(var(--ink))]">
            {tag}
          </span>
        ))}
      </div>
      {!isList && (
        <div className="absolute bottom-4 right-4 rounded-full bg-[rgb(var(--surface))] px-4 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.15)]">
          <p className="font-display text-lg font-bold tracking-tight text-[rgb(var(--ink))]">{formatCurrency(item.price, item.currency)}</p>
        </div>
      )}
    </div>
  );
}
