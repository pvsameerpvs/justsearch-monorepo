"use client";

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY?.trim() ?? '';

interface HereGeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<HereGeocodeResult | null> {
  if (!HERE_API_KEY || !address.trim()) return null;

  const url =
    `https://geocode.search.hereapi.com/v1/geocode` +
    `?q=${encodeURIComponent(address)}` +
    `&in=countryCode:ARE` +
    `&lang=en-US` +
    `&apiKey=${HERE_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: Array<{ position?: { lat: number; lng: number } }> };
    const item = data?.items?.[0];
    if (!item?.position) return null;
    return {
      lat: item.position.lat,
      lng: item.position.lng,
    };
  } catch {
    return null;
  }
}
