import { RestaurantDeliveryCartBar } from './restaurant-delivery-cart-bar';
import { RestaurantDeliveryCartSheet } from './restaurant-delivery-cart-sheet';
import type { DeliveryCartLine } from './use-restaurant-fulfillment';
import { useState } from 'react';

interface DeliveryCartSectionProps {
  currency: string;
  cart: DeliveryCartLine[];
  cartCount: number;
  total: number;
  savings: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClear: () => void;
}

export function DeliveryCartSection({
  currency,
  cart,
  cartCount,
  total,
  savings,
  onUpdateQuantity,
  onClear,
}: DeliveryCartSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RestaurantDeliveryCartBar
        currency={currency}
        cartCount={cartCount}
        total={total}
        savings={savings}
        onOpenCart={() => setIsOpen(true)}
      />
      <RestaurantDeliveryCartSheet
        open={isOpen}
        currency={currency}
        cart={cart}
        total={total}
        savings={savings}
        onClose={() => setIsOpen(false)}
        onClear={onClear}
        onUpdateQuantity={onUpdateQuantity}
      />
    </>
  );
}
