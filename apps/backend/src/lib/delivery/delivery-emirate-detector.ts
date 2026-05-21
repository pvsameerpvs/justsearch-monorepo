import type { UaeEmirate } from '../../types/delivery.types';

const HERE_API_KEY = process.env.HERE_API_KEY?.trim() ?? '';

const EMIRATE_ALIASES: Record<string, UaeEmirate> = {
  dubai: 'Dubai',
  'abu dhabi': 'Abu Dhabi',
  'al ain': 'Abu Dhabi',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  'ras al khaimah': 'Ras Al Khaimah',
  rak: 'Ras Al Khaimah',
  fujairah: 'Fujairah',
  'umm al quwain': 'Umm Al Quwain',
  uaq: 'Umm Al Quwain',
};

export async function detectEmirateFromCoords(
  lat: number,
  lng: number
): Promise<UaeEmirate | null> {
  if (!HERE_API_KEY) return null;
  try {
    const url =
      `https://revgeocode.search.hereapi.com/v1/revgeocode` +
      `?at=${lat},${lng}` +
      `&lang=en-US` +
      `&apiKey=${HERE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      items?: Array<{ address?: { county?: string; city?: string; state?: string } }>;
    };
    const addr = data?.items?.[0]?.address;
    if (!addr) return null;

    const raw = `${addr.county ?? ''} ${addr.city ?? ''} ${addr.state ?? ''}`.toLowerCase();

    for (const [alias, emirate] of Object.entries(EMIRATE_ALIASES)) {
      if (raw.includes(alias)) return emirate;
    }
    return null;
  } catch {
    return null;
  }
}
