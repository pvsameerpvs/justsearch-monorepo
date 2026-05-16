import type { GeolocationCoordinates } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';

export type MapSelection = { type: 'pinned' } | { type: 'saved'; id: string };

export type CheckoutMapAddressPickerProps = {
  pinnedAddress: string;
  pinnedCoords: GeolocationCoordinates | null;
  addresses: SavedAddress[];
  selection: MapSelection;
  isLocating: boolean;
  onSelectPinned: () => void;
  onSelectSaved: (id: string) => void;
  onLocateMe: () => void;
  onUsePinnedForOrder: () => void;
  onPinnedLocationChange: (address: string, coords: GeolocationCoordinates | null) => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
};

export const DUBAI_DEFAULT_COORDS: GeolocationCoordinates = {
  latitude: 25.2048,
  longitude: 55.2708,
};

export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY?.trim() ?? '';
export const MAX_SEARCH_SUGGESTIONS = 3;

export type HereAutosuggestItem = {
  title?: string;
  address?: { label?: string };
  position?: { lat?: number; lng?: number };
};

export type AddressSuggestion = {
  id: string;
  title: string;
  subtitle?: string;
  coords: GeolocationCoordinates | null;
};
