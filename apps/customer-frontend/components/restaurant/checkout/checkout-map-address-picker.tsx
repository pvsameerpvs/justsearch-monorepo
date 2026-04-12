"use client";

import { Loader2, LocateFixed, MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { GeolocationCoordinates } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';
import { useHereInteractiveMap } from './use-here-interactive-map';

type MapSelection = { type: 'pinned' } | { type: 'saved'; id: string };

type CheckoutMapAddressPickerProps = {
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

const DUBAI_DEFAULT_COORDS: GeolocationCoordinates = {
  latitude: 25.2048,
  longitude: 55.2708,
};

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY?.trim() ?? '';
const MAX_SEARCH_SUGGESTIONS = 3;

type HereAutosuggestItem = {
  title?: string;
  address?: {
    label?: string;
  };
  position?: {
    lat?: number;
    lng?: number;
  };
};

type AddressSuggestion = {
  id: string;
  title: string;
  subtitle?: string;
  coords: GeolocationCoordinates | null;
};

function buildMapEmbedUrl(coords: GeolocationCoordinates) {
  const delta = 0.006;
  const south = coords.latitude - delta;
  const north = coords.latitude + delta;
  const west = coords.longitude - delta;
  const east = coords.longitude + delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`;
}

async function reverseGeocodeByCoords(coords: GeolocationCoordinates): Promise<string> {
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

function isSavedSelected(selection: MapSelection, addressId: string) {
  return selection.type === 'saved' && selection.id === addressId;
}

export function CheckoutMapAddressPicker({
  pinnedAddress,
  pinnedCoords,
  addresses,
  selection,
  isLocating,
  onSelectPinned,
  onSelectSaved,
  onLocateMe,
  onUsePinnedForOrder,
  onPinnedLocationChange,
  onPrimaryAction,
  primaryActionLabel,
}: CheckoutMapAddressPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPinResolving, setIsPinResolving] = useState(false);
  const searchRequestIdRef = useRef(0);
  const pinResolveRequestIdRef = useRef(0);

  const filteredAddresses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return addresses;
    }

    return addresses.filter((address) => {
      const searchableText = `${address.label} ${address.address} ${address.details}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [addresses, searchQuery]);

  const mapCenter = pinnedCoords ?? DUBAI_DEFAULT_COORDS;
  const mapUrl = buildMapEmbedUrl(mapCenter);

  const { mapContainerRef, isMapReady, mapLoadError } = useHereInteractiveMap({
    apiKey: HERE_API_KEY,
    center: mapCenter,
    enabled: Boolean(HERE_API_KEY),
    onTap: async (coords) => {
      const runId = pinResolveRequestIdRef.current + 1;
      pinResolveRequestIdRef.current = runId;
      setIsPinResolving(true);

      try {
        const resolvedAddress = await reverseGeocodeByCoords(coords);

        if (pinResolveRequestIdRef.current !== runId) {
          return;
        }

        onPinnedLocationChange(resolvedAddress, coords);
      } finally {
        if (pinResolveRequestIdRef.current === runId) {
          setIsPinResolving(false);
        }
      }
    },
  });

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const runId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = runId;

    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);

        if (!HERE_API_KEY) {
          const fallback = addresses
            .filter((address) => {
              const text = `${address.label} ${address.address} ${address.details}`.toLowerCase();
              return text.includes(trimmedQuery.toLowerCase());
            })
            .slice(0, MAX_SEARCH_SUGGESTIONS)
            .map((address) => ({
              id: address.id,
              title: address.address,
              subtitle: `${address.label} · ${address.details}`,
              coords: null,
            }));

          if (searchRequestIdRef.current === runId) {
            setSuggestions(fallback);
          }

          return;
        }

        const params = new URLSearchParams({
          at: `${mapCenter.latitude},${mapCenter.longitude}`,
          q: trimmedQuery,
          lang: 'en-GB',
          limit: String(MAX_SEARCH_SUGGESTIONS),
          apiKey: HERE_API_KEY,
        });

        const response = await fetch(
          `https://autosuggest.search.hereapi.com/v1/autosuggest?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error('Autosuggest request failed');
        }

        const payload = (await response.json()) as { items?: HereAutosuggestItem[] };
        const nextSuggestions = (payload.items ?? [])
          .slice(0, MAX_SEARCH_SUGGESTIONS)
          .map((item, index) => {
            const title =
              item.address?.label?.trim() ||
              item.title?.trim() ||
              `Result ${index + 1}`;

            const subtitle =
              item.title && item.address?.label && item.title !== item.address.label
                ? item.title
                : undefined;

            const lat = item.position?.lat;
            const lng = item.position?.lng;

            return {
              id: `${title}-${index}`,
              title,
              subtitle,
              coords:
                typeof lat === 'number' && typeof lng === 'number'
                  ? { latitude: lat, longitude: lng }
                  : null,
            };
          });

        if (searchRequestIdRef.current === runId) {
          setSuggestions(nextSuggestions);
        }
      } catch {
        if (searchRequestIdRef.current === runId) {
          setSuggestions([]);
        }
      } finally {
        if (searchRequestIdRef.current === runId) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [addresses, mapCenter.latitude, mapCenter.longitude, searchQuery]);

  const onPickSuggestion = (suggestion: AddressSuggestion) => {
    setSearchQuery(suggestion.title);
    setSuggestions([]);
    onPinnedLocationChange(
      suggestion.title,
      suggestion.coords ?? {
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-[20px] border border-[rgb(var(--border)/0.68)] bg-[rgb(var(--card-surface-muted)/0.72)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[rgb(var(--muted))]" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Enter an address"
            className="w-full bg-transparent text-sm font-medium text-[rgb(var(--ink))] outline-none placeholder:text-[rgb(var(--muted))]"
          />
        </div>

        {(isLoadingSuggestions || suggestions.length > 0) && (
          <div className="absolute left-2 right-2 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[16px] border border-[rgb(var(--border)/0.72)] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.15)]">
            {isLoadingSuggestions ? (
              <p className="px-3 py-2.5 text-xs font-medium text-[rgb(var(--muted))]">
                Searching addresses...
              </p>
            ) : (
              suggestions.slice(0, MAX_SEARCH_SUGGESTIONS).map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => onPickSuggestion(suggestion)}
                  className="block w-full border-b border-[rgb(var(--border)/0.5)] px-3 py-2.5 text-left last:border-b-0 hover:bg-[rgb(var(--card-surface-muted)/0.65)]"
                >
                  <p className="line-clamp-1 text-sm font-semibold text-[rgb(var(--ink))]">
                    {suggestion.title}
                  </p>
                  {suggestion.subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-[rgb(var(--muted))]">
                      {suggestion.subtitle}
                    </p>
                  ) : null}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[22px] border border-[rgb(var(--border)/0.72)]">
        <div className="relative h-[230px] w-full bg-slate-100">
          {HERE_API_KEY ? (
            <div
              ref={mapContainerRef}
              aria-label="Delivery location map"
              className="h-full w-full touch-pan-x touch-pan-y"
            />
          ) : (
            <iframe
              src={mapUrl}
              title="Delivery location map"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}

          <div className="absolute left-3 right-3 top-3 rounded-[14px] bg-[rgb(255,221,31)] px-3 py-2 shadow-md">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-[rgb(35,31,32)]">
              {pinnedAddress}
            </p>
          </div>

          {HERE_API_KEY ? (
            <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-[2px]">
              <span className="inline-flex items-center gap-1.5">
                {isPinResolving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
                {isPinResolving ? 'Updating pin...' : 'Tap map to choose pin'}
              </span>
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-[2px]">
              Add HERE API key for interactive pin selection.
            </div>
          )}

          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border)/0.65)] bg-white px-3 py-2 text-xs font-semibold text-[rgb(var(--ink))] shadow-md disabled:opacity-65"
          >
            <LocateFixed className={cn('h-4 w-4', isLocating && 'animate-pulse')} />
            {isLocating ? 'Locating...' : 'Locate me'}
          </button>

          {HERE_API_KEY && !isMapReady ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[1px]">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[rgb(var(--ink))] shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-[rgb(var(--brand))]" />
                Loading map...
              </p>
            </div>
          ) : null}

          {mapLoadError ? (
            <div className="absolute inset-x-3 bottom-14 rounded-[12px] border border-[rgb(255,139,139)] bg-[rgb(255,243,243)] px-3 py-2 text-[12px] font-medium text-[rgb(170,37,37)]">
              {mapLoadError}
            </div>
          ) : null}
        </div>

        <div className="border-t border-[rgb(var(--border)/0.7)] bg-[rgb(255,247,214)] px-4 py-3">
          <p className="text-sm font-medium text-[rgb(91,74,0)]">
            Your courier will deliver to the pinned location.
          </p>
        </div>
      </div>

      <div className="max-h-[220px] space-y-2 overflow-y-auto rounded-[18px] border border-[rgb(var(--border)/0.68)] bg-white p-2.5">
        <button
          type="button"
          onClick={onSelectPinned}
          className={cn(
            'flex w-full items-start justify-between gap-3 rounded-[14px] px-3 py-3 text-left',
            selection.type === 'pinned'
              ? 'bg-[rgb(var(--brand-soft)/0.3)]'
              : 'hover:bg-[rgb(var(--card-surface-muted)/0.5)]',
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">
              {pinnedAddress}
            </p>
            <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
              Pinned location
            </p>
          </div>
          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--ink)/0.35)]">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                selection.type === 'pinned' ? 'bg-[rgb(var(--ink))]' : 'bg-transparent',
              )}
            />
          </span>
        </button>

        {filteredAddresses.map((address) => (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelectSaved(address.id)}
            className={cn(
              'flex w-full items-start justify-between gap-3 rounded-[14px] px-3 py-3 text-left',
              isSavedSelected(selection, address.id)
                ? 'bg-[rgb(var(--brand-soft)/0.3)]'
                : 'hover:bg-[rgb(var(--card-surface-muted)/0.5)]',
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[rgb(var(--ink))]">
                {address.address}
              </p>
              <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
                {address.label} · {address.details}
              </p>
            </div>
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--ink)/0.35)]">
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  isSavedSelected(selection, address.id)
                    ? 'bg-[rgb(var(--ink))]'
                    : 'bg-transparent',
                )}
              />
            </span>
          </button>
        ))}
      </div>

      {selection.type === 'pinned' ? (
        <button
          type="button"
          onClick={onUsePinnedForOrder}
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgb(var(--brand)/0.38)] bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--brand))]"
        >
          Use this location for current order
        </button>
      ) : null}

      <button
        type="button"
        onClick={onPrimaryAction}
        className="inline-flex w-full items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99]"
      >
        {primaryActionLabel}
      </button>
    </div>
  );
}
