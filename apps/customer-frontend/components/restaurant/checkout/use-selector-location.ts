"use client";

import { useState } from 'react';
import { useGeolocation, type GeolocationCoordinates } from '../use-geolocation';

export type UseSelectorLocationReturn = {
  currentLocationAddress: string | null;
  currentLocationCoords: GeolocationCoordinates | null;
  isLocating: boolean;
  error: string | null;
  openMapMode: ({ address, coords }: { address: string; coords: GeolocationCoordinates | null }) => void;
  handleUseCurrentLocation: (getFallbackAddress: () => string) => Promise<{ address: string; coords: GeolocationCoordinates | null }>;
  reset: () => void;
};

export function useSelectorLocation(): UseSelectorLocationReturn {
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<GeolocationCoordinates | null>(null);
  const { getCurrentLocation, isLocating, error } = useGeolocation();

  const openMapMode = ({ address, coords }: { address: string; coords: GeolocationCoordinates | null }) => {
    setCurrentLocationAddress(address);
    setCurrentLocationCoords(coords);
  };

  const handleUseCurrentLocation = async (getFallbackAddress: () => string) => {
    const result = await getCurrentLocation();
    if (result.address) {
      openMapMode({ address: result.address, coords: result.coords });
      return { address: result.address, coords: result.coords };
    }
    if (error) alert(error);
    const fallback = getFallbackAddress();
    openMapMode({ address: fallback, coords: null });
    return { address: fallback, coords: null };
  };

  const reset = () => {
    setCurrentLocationAddress(null);
    setCurrentLocationCoords(null);
  };

  return {
    currentLocationAddress,
    currentLocationCoords,
    isLocating,
    error,
    openMapMode,
    handleUseCurrentLocation,
    reset,
  };
}
