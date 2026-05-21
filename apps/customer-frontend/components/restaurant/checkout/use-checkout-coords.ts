"use client";

import { useState } from 'react';

export function useCheckoutCoords() {
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});

  const setLatLng = (lat: number, lng: number) => setCoords({ lat, lng });
  const clearCoords = () => setCoords({});

  return {
    lat: coords.lat,
    lng: coords.lng,
    hasCoords: coords.lat != null && coords.lng != null,
    setLatLng,
    clearCoords,
  };
}
