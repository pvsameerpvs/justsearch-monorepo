"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useHereInteractiveMap } from './use-here-interactive-map';
import { DUBAI_DEFAULT_COORDS, HERE_API_KEY, MAX_SEARCH_SUGGESTIONS, type AddressSuggestion, type CheckoutMapAddressPickerProps, type HereAutosuggestItem } from './checkout-map-types';
import { buildMapEmbedUrl, reverseGeocodeByCoords } from './checkout-map-utils';
import { CheckoutMapSearch } from './checkout-map-search';
import { CheckoutMapEmbed } from './checkout-map-embed';
import { CheckoutAddressList } from './checkout-address-list';

export function CheckoutMapAddressPicker({ pinnedAddress, pinnedCoords, addresses, selection, isLocating, onSelectPinned, onSelectSaved, onLocateMe, onUsePinnedForOrder, onPinnedLocationChange, onPrimaryAction, primaryActionLabel }: CheckoutMapAddressPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPinResolving, setIsPinResolving] = useState(false);
  const searchRequestIdRef = useRef(0), pinResolveRequestIdRef = useRef(0);
  const filteredAddresses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return addresses;
    return addresses.filter((a) => `${a.label} ${a.address} ${a.details}`.toLowerCase().includes(q));
  }, [addresses, searchQuery]);
  const mapCenter = pinnedCoords ?? DUBAI_DEFAULT_COORDS, mapUrl = buildMapEmbedUrl(mapCenter);
  const { mapContainerRef, isMapReady, mapLoadError } = useHereInteractiveMap({
    apiKey: HERE_API_KEY, center: mapCenter, enabled: Boolean(HERE_API_KEY),
    onTap: async (coords) => {
      const runId = ++pinResolveRequestIdRef.current;
      setIsPinResolving(true);
      try {
        const addr = await reverseGeocodeByCoords(coords);
        if (pinResolveRequestIdRef.current !== runId) return;
        onPinnedLocationChange(addr, coords);
      } finally {
        if (pinResolveRequestIdRef.current === runId) setIsPinResolving(false);
      }
    },
  });
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) { setSuggestions([]); setIsLoadingSuggestions(false); return; }
    const runId = ++searchRequestIdRef.current;
    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        if (!HERE_API_KEY) {
          const fallback = addresses.filter((a) => `${a.label} ${a.address} ${a.details}`.toLowerCase().includes(trimmed.toLowerCase())).slice(0, MAX_SEARCH_SUGGESTIONS).map((a) => ({ id: a.id, title: a.address, subtitle: `${a.label} · ${a.details}`, coords: null }));
          if (searchRequestIdRef.current === runId) setSuggestions(fallback);
          return;
        }
        const params = new URLSearchParams({ at: `${mapCenter.latitude},${mapCenter.longitude}`, q: trimmed, lang: 'en-GB', limit: String(MAX_SEARCH_SUGGESTIONS), apiKey: HERE_API_KEY });
        const res = await fetch(`https://autosuggest.search.hereapi.com/v1/autosuggest?${params.toString()}`);
        if (!res.ok) throw new Error('Autosuggest request failed');
        const payload = (await res.json()) as { items?: HereAutosuggestItem[] };
        const next = (payload.items ?? []).slice(0, MAX_SEARCH_SUGGESTIONS).map((item, index) => {
          const title = item.address?.label?.trim() || item.title?.trim() || `Result ${index + 1}`;
          const subtitle = item.title && item.address?.label && item.title !== item.address.label ? item.title : undefined;
          const lat = item.position?.lat, lng = item.position?.lng;
          return { id: `${title}-${index}`, title, subtitle, coords: typeof lat === 'number' && typeof lng === 'number' ? { latitude: lat, longitude: lng } : null };
        });
        if (searchRequestIdRef.current === runId) setSuggestions(next);
      } catch {
        if (searchRequestIdRef.current === runId) setSuggestions([]);
      } finally {
        if (searchRequestIdRef.current === runId) setIsLoadingSuggestions(false);
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [addresses, mapCenter.latitude, mapCenter.longitude, searchQuery]);
  return (<div className="space-y-4">
    <CheckoutMapSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} isLoadingSuggestions={isLoadingSuggestions} suggestions={suggestions} onSelectSuggestion={(s) => { setSearchQuery(s.title); setSuggestions([]); onPinnedLocationChange(s.title, s.coords ?? { latitude: mapCenter.latitude, longitude: mapCenter.longitude }); }} />
    <CheckoutMapEmbed mapContainerRef={mapContainerRef} isMapReady={isMapReady} mapLoadError={mapLoadError} mapUrl={mapUrl} pinnedAddress={pinnedAddress} isPinResolving={isPinResolving} isLocating={isLocating} onLocateMe={onLocateMe} />
    <CheckoutAddressList pinnedAddress={pinnedAddress} filteredAddresses={filteredAddresses} selection={selection} onSelectPinned={onSelectPinned} onSelectSaved={onSelectSaved} />
    {selection.type === 'pinned' && <button type="button" onClick={onUsePinnedForOrder} className="inline-flex w-full items-center justify-center rounded-full border border-[rgb(var(--brand)/0.38)] bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--brand))]">Use this location for current order</button>}
    <button type="button" onClick={onPrimaryAction} className="inline-flex w-full items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99]">{primaryActionLabel}</button>
  </div>);
}
