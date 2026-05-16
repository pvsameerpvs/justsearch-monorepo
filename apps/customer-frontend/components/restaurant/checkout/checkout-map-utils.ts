import { HERE_API_KEY } from './checkout-map-types';
import type { MapSelection } from './checkout-map-types';
import type { GeolocationCoordinates } from '../use-geolocation';

export function buildMapEmbedUrl(coords: GeolocationCoordinates) {
  const delta = 0.006;
  const south = coords.latitude - delta;
  const north = coords.latitude + delta;
  const west = coords.longitude - delta;
  const east = coords.longitude + delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`;
}

export async function reverseGeocodeByCoords(coords: GeolocationCoordinates): Promise<string> {
  if (!HERE_API_KEY) {
    return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
  }

  const params = new URLSearchParams({
    at: `${coords.latitude},${coords.longitude}`,
    lang: 'en-GB',
    apiKey: HERE_API_KEY,
  });

  const response = await fetch(
    `https://revgeocode.search.hereapi.com/v1/revgeocode?${params.toString()}`,
  );

  if (!response.ok) {
    return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
  }

  const payload = (await response.json()) as {
    items?: Array<{ title?: string; address?: { label?: string } }>;
  };

  const firstItem = payload.items?.[0];
  const label = firstItem?.address?.label?.trim() || firstItem?.title?.trim();

  if (!label) {
    return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
  }

  return label;
}

export function isSavedSelected(selection: MapSelection, addressId: string) {
  return selection.type === 'saved' && selection.id === addressId;
}
