import { getDeliveryConfig, getDeliveryQuote } from '../../lib/delivery/delivery-quote.service';
import type { DeliveryQuoteResponse } from '../../types/delivery.types';

export async function validateDeliveryOnCreate(
  restaurantId: string,
  fulfillmentType: string,
  lat: number | undefined,
  lng: number | undefined,
  frontendFee: number
): Promise<{ quote: DeliveryQuoteResponse } | { error: string }> {
  if (fulfillmentType !== 'delivery') {
    return { quote: { available: true } };
  }

  // If restaurant hasn't configured delivery, skip coordinate validation
  const config = await getDeliveryConfig(restaurantId);
  if (!config || !config.enabled) {
    return { quote: { available: true } };
  }

  if (lat == null || lng == null) {
    return { error: 'Delivery address coordinates are required' };
  }

  const quote = await getDeliveryQuote(restaurantId, lat, lng);
  if (!quote.available) {
    return { error: quote.reason ?? 'Delivery not available for this address' };
  }

  const expectedFee = quote.fee ?? 0;
  if (Math.abs(frontendFee - expectedFee) > 0.01) {
    return { error: 'Delivery fee has changed. Please refresh checkout.' };
  }

  return { quote };
}
