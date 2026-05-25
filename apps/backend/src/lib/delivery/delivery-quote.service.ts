import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { UAE_EMIRATES } from '../../types/delivery.types';
import type {
  DeliveryConfig,
  DeliveryQuoteResponse,
  DeliveryTier,
  UaeEmirate,
} from '../../types/delivery.types';
import { detectEmirateFromCoords } from './delivery-emirate-detector';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findMatchingTier(distanceKm: number, tiers: DeliveryTier[]): DeliveryTier | undefined {
  const sorted = [...tiers].sort((a, b) => a.minKm - b.minKm);
  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i];
    const isLast = i === sorted.length - 1;
    // Middle tiers: half-open [min, max) to avoid overlap
    // Last tier: closed [min, max] so exact maxRadiusKm boundary is covered
    if (distanceKm >= t.minKm && (isLast ? distanceKm <= t.maxKm : distanceKm < t.maxKm)) {
      return t;
    }
  }
  return undefined;
}

export async function getDeliveryConfig(restaurantId: string): Promise<DeliveryConfig | null> {
  const [row] = await db
    .select({ settings: restaurants.settings })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!row) return null;
  const settings = (row.settings ?? {}) as Record<string, unknown>;
  const raw = settings.delivery;
  if (!raw || typeof raw !== 'object') return null;

  const d = raw as Record<string, unknown>;
  const tiers = Array.isArray(d.tiers)
    ? d.tiers.filter((t): t is DeliveryTier =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Record<string, unknown>).minKm === 'number' &&
        typeof (t as Record<string, unknown>).maxKm === 'number' &&
        typeof (t as Record<string, unknown>).fee === 'number'
      )
    : [];

  const emirates = Array.isArray(d.emirates)
    ? d.emirates.filter((e): e is UaeEmirate =>
        typeof e === 'string' && (UAE_EMIRATES as readonly string[]).includes(e)
      )
    : (UAE_EMIRATES as UaeEmirate[]);

  return {
    enabled: Boolean(d.enabled),
    maxRadiusKm: Number(d.maxRadiusKm ?? 0),
    restaurantLat: Number(d.restaurantLat ?? 0),
    restaurantLng: Number(d.restaurantLng ?? 0),
    emirates,
    tiers,
  };
}

export async function getDeliveryQuote(
  restaurantId: string,
  customerLat: number,
  customerLng: number
): Promise<DeliveryQuoteResponse> {
  const config = await getDeliveryConfig(restaurantId);
  if (!config || !config.enabled) {
    return { available: false, reason: 'Delivery not available for this restaurant' };
  }

  const distanceKm = haversineDistanceKm(
    config.restaurantLat,
    config.restaurantLng,
    customerLat,
    customerLng
  );

  if (distanceKm > config.maxRadiusKm) {
    return {
      available: false,
      reason: `Delivery not available — your address is ${distanceKm.toFixed(1)} km away (max ${config.maxRadiusKm} km)`,
    };
  }

  const detectedEmirate = await detectEmirateFromCoords(customerLat, customerLng);

  if (detectedEmirate && config.emirates.length > 0) {
    const allowed = config.emirates.includes(detectedEmirate);
    if (!allowed) {
      return {
        available: false,
        reason: `Restaurant does not deliver to ${detectedEmirate}`,
        emirate: detectedEmirate,
      };
    }
  }

  const tier = findMatchingTier(distanceKm, config.tiers);
  if (!tier) {
    return { available: false, reason: 'No delivery tier matches your address distance' };
  }

  return {
    available: true,
    distanceKm: Number(distanceKm.toFixed(2)),
    fee: tier.fee,
    tier,
    emirate: detectedEmirate ?? undefined,
  };
}
