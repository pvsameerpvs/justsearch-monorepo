import { Check, Clock3 } from 'lucide-react';
import { cn } from '@/lib/cn';
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

interface AvailabilityBadgeProps {
  available: boolean;
  size?: 'sm' | 'md';
}

export function AvailabilityBadge({ available, size = 'md' }: AvailabilityBadgeProps) {
  const isSm = size === 'sm';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-${isSm ? '2 py-1 text-[9px]' : '3 py-1.5 text-[10px]'} font-bold uppercase tracking-[0.1em] ${
      available ? 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]' : 'bg-[rgb(var(--border)/0.78)] text-[rgb(var(--muted))]'
    }`}>
      {available ? <Check className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} /> : <Clock3 className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
      {available ? 'Available' : 'Limited'}
    </span>
  );
}

interface CartQuantityControlsProps {
  itemId: string;
  quantity: number;
  onUpdate: (id: string, quantity: number) => void;
  size?: 'sm' | 'md';
}

export function CartQuantityControls({ itemId, quantity, onUpdate, size = 'md' }: CartQuantityControlsProps) {
  const isSm = size === 'sm';
  return (
    <div className={`inline-flex items-center rounded-full ${isSm ? 'bg-white p-1 shadow-sm' : 'bg-[rgb(var(--card-surface-muted)/0.9)] p-1'}`}>
      <button
        type="button"
        onClick={() => onUpdate(itemId, quantity - 1)}
        className={`flex items-center justify-center rounded-full font-semibold text-[rgb(var(--ink))] ${isSm ? 'h-8 w-8 text-lg' : 'h-9 w-9 text-lg'}`}
      >
        -
      </button>
      <span className={`text-center font-bold text-[rgb(var(--ink))] ${isSm ? 'min-w-[1.75rem] text-sm' : 'min-w-[2rem] text-sm'}`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(itemId, quantity + 1)}
        className={`flex items-center justify-center rounded-full font-semibold text-[rgb(var(--ink))] ${isSm ? 'h-8 w-8 text-lg' : 'h-9 w-9 text-lg'}`}
      >
        +
      </button>
    </div>
  );
}

interface AddToCartButtonProps {
  onClick: () => void;
}

export function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-11 w-full items-center justify-center rounded-[14px] text-sm font-semibold transition-all',
        'bg-[rgb(var(--brand))] text-white shadow-[0_16px_28px_rgb(var(--brand)/0.2)] hover:brightness-105',
      )}
    >
      Add to Delivery Cart
    </button>
  );
}

interface SmallAddButtonProps {
  onClick: () => void;
}

export function SmallAddButton({ onClick }: SmallAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-semibold text-[rgb(var(--ink))] shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-all hover:brightness-105"
    >
      +
    </button>
  );
}

export function ListViewFooter({ item, isDeliveryMode, cartQuantity, onAddToCart, onUpdateCartQuantity }: {
  item: MenuItem;
  isDeliveryMode: boolean;
  cartQuantity: number;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateCartQuantity?: (itemId: string, quantity: number) => void;
}) {
  return (
    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-4 sm:pt-4">
      <AvailabilityBadge available={item.isAvailable} size="sm" />
      {isDeliveryMode && item.isAvailable && onAddToCart ? (
        cartQuantity > 0 && onUpdateCartQuantity ? (
          <CartQuantityControls itemId={item.id} quantity={cartQuantity} onUpdate={onUpdateCartQuantity} size="sm" />
        ) : (
          <SmallAddButton onClick={() => onAddToCart(item)} />
        )
      ) : (
        <button className="text-[9px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] hover:underline sm:text-[10px]">View Details</button>
      )}
    </div>
  );
}

export function GridViewFooter({ item, isDeliveryMode, cartQuantity, onAddToCart, onUpdateCartQuantity }: {
  item: MenuItem;
  isDeliveryMode: boolean;
  cartQuantity: number;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateCartQuantity?: (itemId: string, quantity: number) => void;
}) {
  if (!isDeliveryMode || !item.isAvailable || !onAddToCart) return null;

  return (
    <div className="mt-4">
      {cartQuantity > 0 && onUpdateCartQuantity ? (
        <CartQuantityControls itemId={item.id} quantity={cartQuantity} onUpdate={onUpdateCartQuantity} />
      ) : (
        <AddToCartButton onClick={() => onAddToCart(item)} />
      )}
    </div>
  );
}
