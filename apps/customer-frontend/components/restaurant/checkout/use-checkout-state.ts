"use client";

import { useMemo, useState } from 'react';
import { useRestaurantFulfillment } from '../fulfillment';
import { useCheckoutAddress } from './use-checkout-address';
import { useCheckoutPromo } from './use-checkout-promo';
import { useCheckoutPlace } from './use-checkout-place';
import { getCheckoutLineTotal } from './checkout.constants';

export function useCheckoutState() {
  const { cart, cartCount, total, deliverySavings, placeOrder } = useRestaurantFulfillment();
  const address = useCheckoutAddress();
  const promo = useCheckoutPromo(total);
  const place = useCheckoutPlace();

  const [handoff, setHandoff] = useState('Hand it to me');
  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const displayItems = useMemo(
    () => cart.map((item) => ({ ...item, lineTotal: getCheckoutLineTotal(item) })),
    [cart]
  );

  const promoDiscount = promo.discount;
  const displayTotal = Math.max(0, total - promoDiscount);
  const displaySavings = deliverySavings + promoDiscount;

  const onApplyPromo = (code: string) => {
    if (!code) {
      setAppliedPromoCode(null);
      promo.setPromoCode('');
      return;
    }
    promo.setPromoCode(code);
    promo.applyPromoCode();
    setAppliedPromoCode(code);
  };

  const onPlaceOrder = async () => {
    if (place.placingOrder) return;

    const combinedAddress = `${address.addressTitle} - ${address.address}\n${address.addressDetails}${address.alternateNumber ? `\nAlt number: ${address.alternateNumber}` : ''}\n${handoff}${riderNote ? `\nNote for rider: ${riderNote}` : ''}`;

    const orderId = await placeOrder({
      address: combinedAddress,
      note: restaurantNote,
      promoCode: promo.appliedVoucher?.code,
      promoDiscount: promo.discount || undefined,
    });

    if (!orderId) {
      place.setPlaceError('Add at least one item and a delivery address before placing the order.');
      return;
    }

    promo.consumePromo();
    place.startPlacing(orderId);
  };

  return {
    cartCount,
    total,
    currency: cart[0]?.currency ?? 'AED',
    ...address,
    handoff,
    setHandoff,
    riderNote,
    setRiderNote,
    restaurantNote,
    setRestaurantNote,
    displayItems,
    displaySavings,
    displayTotal,
    promoDiscount: promo.discount,
    appliedPromoCode,
    onApplyPromo,
    error: place.error,
    placedOrderId: place.placedOrderId,
    placingOrder: place.placingOrder,
    placingProgress: place.placingProgress,
    onPlaceOrder,
  };
}
