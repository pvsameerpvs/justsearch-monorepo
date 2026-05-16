import Image from 'next/image';
import { formatCurrency } from '@/lib/format';

export type CartItem = {
  itemId: string; quantity: number; name: string; price: number; currency: string; image?: string; lineTotal: number;
};

type Props = { item: CartItem; onUpdateQuantity: (itemId: string, quantity: number) => void; };

export function RestaurantDeliveryCartItem({ item, onUpdateQuantity }: Props) {
  return (
    <article className="border-b border-[rgb(var(--border)/0.6)] pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-bold leading-tight text-[rgb(var(--ink))]">{item.name}</p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">One portion</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-[rgb(var(--brand))]">{formatCurrency(item.price, item.currency)}</p>
        </div>
        <div className="w-[92px] shrink-0">
          <div className="overflow-hidden rounded-[18px] border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--card-surface-muted)/0.8)]">
            {item.image ? (
              <div className="relative h-[84px] w-full"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="100px" /></div>
            ) : (
              <div className="flex h-[84px] items-center justify-center text-sm text-[rgb(var(--muted))]">Item</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <div className="inline-flex items-center rounded-full bg-[rgb(var(--card-surface-muted)/0.9)] p-1">
          <button type="button" onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold text-[rgb(var(--ink))]">-</button>
          <span className="min-w-[2.5rem] text-center text-lg font-bold text-[rgb(var(--ink))]">{item.quantity}</span>
          <button type="button" onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold text-[rgb(var(--ink))]">+</button>
        </div>
      </div>
    </article>
  );
}
