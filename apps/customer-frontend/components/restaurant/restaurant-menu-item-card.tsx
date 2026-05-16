import { formatCurrency } from '@/lib/format';
import type { MenuItem } from '@/lib/restaurant-types';
import type { ViewMode } from './restaurant-menu-showcase';
import type { FulfillmentMode } from './use-restaurant-fulfillment';
import { MenuItemImage, AvailabilityBadge, DietaryBadge, ListViewFooter, GridViewFooter } from './menu-item-card-parts';

interface RestaurantMenuItemCardProps {
  item: MenuItem;
  viewMode?: ViewMode;
  fulfillmentMode?: FulfillmentMode;
  cartQuantity?: number;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateCartQuantity?: (itemId: string, quantity: number) => void;
}

export function RestaurantMenuItemCard({
  item,
  viewMode = 'grid',
  fulfillmentMode = 'delivery',
  cartQuantity = 0,
  onAddToCart,
  onUpdateCartQuantity,
}: RestaurantMenuItemCardProps) {
  const isList = viewMode === 'list';
  const isDeliveryMode = fulfillmentMode === 'delivery';

  return (
    <article className={`overflow-hidden rounded-[14px] border border-[rgb(var(--border)/0.7)] bg-[rgb(var(--card-surface-muted)/0.92)] shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_18px_44px_rgba(15,23,42,0.06)] ${isList ? 'flex flex-row' : 'flex flex-col'}`}>
      <MenuItemImage item={item} isList={isList} />

      <div className={`flex flex-1 flex-col justify-between p-4 sm:p-6 ${isList ? 'py-4' : ''}`}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-base font-bold tracking-tight text-[rgb(var(--ink))] sm:text-2xl leading-tight">{item.name}</h3>
                  <DietaryBadge isVeg={item.isVeg} size="sm" />
                </div>
                {isList && (
                  <span className="font-display text-sm font-bold tracking-tight text-[rgb(var(--brand))] sm:text-xl">
                    {formatCurrency(item.price, item.currency)}
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-[rgb(var(--muted))] line-clamp-2 sm:text-sm sm:line-clamp-none">{item.description}</p>
            </div>

            {!isList && <AvailabilityBadge available={item.isAvailable} />}
          </div>
        </div>

        {isList && (
          <ListViewFooter
            item={item}
            isDeliveryMode={isDeliveryMode}
            cartQuantity={cartQuantity}
            onAddToCart={onAddToCart}
            onUpdateCartQuantity={onUpdateCartQuantity}
          />
        )}

        {!isList && (
          <GridViewFooter
            item={item}
            isDeliveryMode={isDeliveryMode}
            cartQuantity={cartQuantity}
            onAddToCart={onAddToCart}
            onUpdateCartQuantity={onUpdateCartQuantity}
          />
        )}
      </div>
    </article>
  );
}
