import { PreviewLogoBadge } from './preview-logo-badge';
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

function rgb(v: string) {
  return `rgb(${v})`;
}

interface PreviewHeroProps {
  restaurant: RestaurantProfile;
}

export function PreviewHero({ restaurant }: PreviewHeroProps) {
  const t = restaurant.theme;
  const domain = `${restaurant.subdomain}.js-restorant.com`;

  return (
    <div
      className="relative mx-3 mt-3 rounded-[32px] p-5 text-center"
      style={{
        border: `1px solid rgba(${t.cardBorder},0.9)`,
        background: `linear-gradient(145deg, rgba(${t.brandSoft},0.45), rgba(${t.cardSurface},0.96), rgba(${t.accentSoft},0.48))`,
        boxShadow: '0 10px 40px rgba(15,23,42,0.06)',
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <PreviewLogoBadge logoUrl={restaurant.logoUrl} name={restaurant.name} theme={t} />

        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: rgb(t.brandColor) }}>
            {restaurant.category || "Restaurant"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight" style={{ color: rgb(t.ink) }}>
            {restaurant.name}
          </h2>
          <p className="mx-auto max-w-[260px] text-xs leading-5 text-slate-600">
            {restaurant.tagline}
          </p>
          {restaurant.description && (
            <p className="mx-auto max-w-[260px] text-[11px] leading-4 text-slate-500">
              {restaurant.description}
            </p>
          )}
          {restaurant.cuisine.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {restaurant.cuisine.map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: `rgba(${t.border},0.7)`,
                    background: `rgba(${t.cardSurface},0.82)`,
                    color: rgb(t.muted || t.ink),
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
          <p className="text-[11px] text-slate-500">{domain}</p>
        </div>
      </div>
    </div>
  );
}
