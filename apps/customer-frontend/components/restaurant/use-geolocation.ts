"use client";

import { useState } from 'react';

export function useGeolocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentAddress = async (): Promise<string | null> => {
    const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return null;
    }

    setIsLocating(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const at = `${latitude},${longitude}`;
            
            // 1. First, get the standard address
            const revUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${at}&lang=en-GB&apiKey=${HERE_API_KEY}`;
            const revRes = await fetch(revUrl);
            const revData = await revRes.json();
            
            // 2. Secondly, discover the nearest BUILDING/PLACE name
            // This is what Noon/Talabat use to find building names like "Damas Tower"
            const discUrl = `https://discover.search.hereapi.com/v1/discover?at=${at}&q=building&limit=1&lang=en-GB&apiKey=${HERE_API_KEY}`;
            const discRes = await fetch(discUrl);
            const discData = await discRes.json();
            
            if ((!revRes.ok && !discRes.ok) || !HERE_API_KEY) {
              const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`);
              const fallbackData = await fallbackRes.json();
              resolve(fallbackData.display_name || null);
              return;
            }

            let buildingName = "";
            if (discData.items && discData.items.length > 0) {
              buildingName = discData.items[0].title;
            }

            if (revData.items && revData.items.length > 0) {
              const addr = revData.items[0].address;
              const parts = [];
              
              if (buildingName) parts.push(buildingName);
              else if (addr.building) parts.push(addr.building);

              if (addr.houseNumber && addr.houseNumber !== buildingName) parts.push(addr.houseNumber);
              if (addr.street) parts.push(addr.street);
              if (addr.district) parts.push(addr.district);
              if (addr.city) parts.push(addr.city);
              
              const uniqueParts = Array.from(new Set(parts));
              resolve(uniqueParts.join(', '));
            } else {
              resolve(buildingName || null);
            }
          } catch (err) {
            console.error("Location error:", err);
            setError("Failed to resolve address.");
            resolve(null);
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          setIsLocating(false);
          let msg = "Could not get your location.";
          if (err.code === 1) msg = "Permission denied. Please allow location access.";
          else if (err.code === 2) msg = "Location unavailable.";
          else if (err.code === 3) msg = "Request timed out.";
          setError(msg);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  return { getCurrentAddress, isLocating, error };
}
