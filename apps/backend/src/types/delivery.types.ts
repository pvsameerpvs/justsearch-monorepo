export interface DeliveryTier {
  minKm: number;
  maxKm: number;
  fee: number;
}

export type UaeEmirate =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'Ras Al Khaimah'
  | 'Fujairah'
  | 'Umm Al Quwain';

export const UAE_EMIRATES: UaeEmirate[] = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
];

export interface DeliveryConfig {
  enabled: boolean;
  maxRadiusKm: number;
  restaurantLat: number;
  restaurantLng: number;
  emirates: UaeEmirate[];
  tiers: DeliveryTier[];
}

export interface DeliveryQuoteResponse {
  available: boolean;
  distanceKm?: number;
  fee?: number;
  tier?: DeliveryTier;
  emirate?: UaeEmirate;
  reason?: string;
}
