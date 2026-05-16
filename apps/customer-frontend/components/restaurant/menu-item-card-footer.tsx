import type { MenuItem } from '@/lib/restaurant-types';
import { AvailabilityBadge } from './menu-item-card-badge';
import { CartQuantityControls } from './menu-item-card-controls';
import { AddToCartButton, SmallAddButton } from './menu-item-card-add-button';

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
