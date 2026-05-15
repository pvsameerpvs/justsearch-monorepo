import Image from 'next/image';
import { getRestaurantInitials, getRestaurantDomain } from "@justsearch/utils";
import type { Restaurant } from "@justsearch/utils";

function rgb(v: string) {
  return `rgb(${v})`;
}

interface PreviewHeroProps {
  restaurant: Restaurant;
}

export function PreviewHero({ restaurant }: PreviewHeroProps) {
  const t = restaurant.theme;
  const domain = getRestaurantDomain(restaurant.subdomain);
  const initials = getRestaurantInitials(restaurant.name);

  return (
    <div
      className="relative p-6 text-center"
      style={{ background: `linear-gradient(145deg, rgba(${t.brandSoft},0.45), rgba(${t.cardSurface},0.96), rgba(${t.accentSoft},0.48))` }}
    >
      <div className="relative mx-auto mb-4 shadow-[0_18px_60px_rgba(15,23,42,0.15)] ring-1 ring-[rgb(${t.border}/0.28)] overflow-hidden border border-[rgb(${t.cardBorder}/0.9)] bg-[rgb(${t.cardSurface}/0.96)] h-28 w-28 rounded-[32px]">
        {restaurant.logoUrl ? (
          <Image src={restaurant.logoUrl} alt="Logo" fill className="object-cover" sizes="112px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-semibold tracking-tight text-white"
            style={{ background: `linear-gradient(145deg, rgb(${t.logoGradientFrom}), rgb(${t.logoGradientTo}/0.92))` }}>
            {initials}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: rgb(t.brandColor) }}>Restaurant Logo</p>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: rgb(t.ink) }}>{restaurant.name}</h2>
        <p className="mx-auto max-w-xs text-sm leading-6 text-slate-600">{restaurant.tagline}</p>
        <p className="text-xs text-slate-500">{domain}</p>
      </div>
    </div>
  );
}
