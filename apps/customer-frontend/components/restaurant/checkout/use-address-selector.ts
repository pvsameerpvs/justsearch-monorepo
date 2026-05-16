"use client";

import { useEffect, useState } from 'react';
import { useGeolocation, type GeolocationCoordinates } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';

export function useAddressSelector(
  open: boolean,
  addresses: SavedAddress[],
  selectedAddressId: string | undefined,
  onClose: () => void,
  onSelectAddress: (address: SavedAddress) => void,
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>,
  _onUseCurrentLocation: (address: string) => void,
) {
  const [mode, setMode] = useState<'list' | 'map' | 'add'>('list');
  const [mapSelection, setMapSelection] = useState<{ type: 'pinned' } | { type: 'saved'; id: string }>({ type: 'pinned' });
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<GeolocationCoordinates | null>(null);
  const { getCurrentLocation, isLocating, error } = useGeolocation();

  useEffect(() => {
    if (open) return;
    setMode('list');
    setMapSelection({ type: 'pinned' });
    setCurrentLocationAddress(null);
    setCurrentLocationCoords(null);
  }, [open]);

  const getFallbackPinnedAddress = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    return selected?.address ?? 'Pinned delivery location';
  };

  const openMapMode = ({ address, coords }: { address: string; coords: GeolocationCoordinates | null }) => {
    setCurrentLocationAddress(address);
    setCurrentLocationCoords(coords);
    setMapSelection({ type: 'pinned' });
    setMode('map');
  };

  const handleUseCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result.address) {
      openMapMode({ address: result.address, coords: result.coords });
      return;
    }
    if (error) alert(error);
    openMapMode({ address: getFallbackPinnedAddress(), coords: null });
  };

  const handleOpenMapChooser = () => {
    openMapMode({
      address: currentLocationAddress ?? getFallbackPinnedAddress(),
      coords: currentLocationCoords ?? null,
    });
  };

  const handleSaveAddress = async (address: Omit<SavedAddress, 'id'>) => {
    await onAddAddress(address);
    setMode('list');
    setCurrentLocationAddress(null);
    setCurrentLocationCoords(null);
    onClose();
  };

  const handleSelectSaved = (id: string) => {
    const selected = addresses.find((a) => a.id === id);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  const handlePrimaryMapAction = () => {
    if (mapSelection.type === 'saved') {
      handleSelectSaved(mapSelection.id);
      return;
    }
    setMode('add');
  };

  const handlePinnedLocationChange = (address: string, coords: GeolocationCoordinates | null) => {
    setCurrentLocationAddress(address);
    setCurrentLocationCoords(coords);
    setMapSelection({ type: 'pinned' });
  };

  const goToAdd = () => {
    setCurrentLocationAddress(null);
    setCurrentLocationCoords(null);
    setMode('add');
  };

  const cancelAdd = () => {
    setMode(currentLocationAddress ? 'map' : 'list');
  };

  return {
    mode,
    mapSelection,
    setMapSelection,
    currentLocationAddress,
    currentLocationCoords,
    isLocating,
    handleUseCurrentLocation,
    handleOpenMapChooser,
    handleSaveAddress,
    handlePrimaryMapAction,
    handlePinnedLocationChange,
    goToAdd,
    cancelAdd,
  };
}
