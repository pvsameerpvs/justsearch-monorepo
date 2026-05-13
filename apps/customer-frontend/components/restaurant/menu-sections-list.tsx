import type { Restaurant } from '@/lib/restaurant-types';
import type { ViewMode } from './restaurant-menu-showcase';
import type { FulfillmentMode } from './use-restaurant-fulfillment';
import { RestaurantMenuCategoryCard } from './restaurant-menu-category-card';

interface MenuSectionsListProps {
  menu: Restaurant['menu'];
  viewMode: ViewMode;
  fulfillmentMode: FulfillmentMode;
  getCartQuantity: (itemId: string) => number;
  onAddToCart: (item: Restaurant['menu'][number]['items'][number]) => void;
  onUpdateCartQuantity: (itemId: string, quantity: number) => void;
}

export function MenuSectionsList({
  menu,
  viewMode,
  fulfillmentMode,
  getCartQuantity,
  onAddToCart,
  onUpdateCartQuantity,
}: MenuSectionsListProps) {
  return (
    <div className="space-y-16 sm:space-y-24">
      {menu.map((category) => (
        <div key={category.id} id={category.id} className="scroll-mt-36">
          <RestaurantMenuCategoryCard
            category={category}
            viewMode={viewMode}
            fulfillmentMode={fulfillmentMode}
            getCartQuantity={getCartQuantity}
            onAddToCart={onAddToCart}
            onUpdateCartQuantity={onUpdateCartQuantity}
          />
        </div>
      ))}
    </div>
  );
}
