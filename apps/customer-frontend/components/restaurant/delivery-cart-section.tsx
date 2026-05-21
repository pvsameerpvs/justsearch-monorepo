import { RestaurantDeliveryCartBar } from './restaurant-delivery-cart-bar';
import { RestaurantDeliveryCartSheet } from './restaurant-delivery-cart-sheet';
import type { DeliveryCartLine } from './use-restaurant-fulfillment';
import type { DeliveryConfig } from '@justsearch/utils';
import { useState } from 'react';

interface DeliveryCartSectionProps {
  currency: string;
  cart: DeliveryCartLine[];
  cartCount: number;
  total: number;
  savings: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClear: () => void;
  deliveryConfig?: DeliveryConfig;
}

function getMinDeliveryFee(config?: DeliveryConfig): number | undefined {
  if (!config?.enabled || config.tiers.length === 0) return undefined;
  return Math.min(...config.tiers.map((t) => t.fee));
}

export function DeliveryCartSection({
  currency,
  cart,
  cartCount,
  total,
  savings,
  onUpdateQuantity,
  onClear,
  deliveryConfig,
}: DeliveryCartSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const estimatedFee = getMinDeliveryFee(deliveryConfig);

  return (
    <>
      <RestaurantDeliveryCartBar
        currency={currency}
        cartCount={cartCount}
        total={total}
        savings={savings}
        estimatedDeliveryFee={estimatedFee}
        onOpenCart={() => setIsOpen(true)}
      />
      <RestaurantDeliveryCartSheet
        open={isOpen}
        currency={currency}
        cart={cart}
        total={total}
        savings={savings}
        estimatedDeliveryFee={estimatedFee}
        onClose={() => setIsOpen(false)}
        onClear={onClear}
        onUpdateQuantity={onUpdateQuantity}
      />
    </>
  );
}
