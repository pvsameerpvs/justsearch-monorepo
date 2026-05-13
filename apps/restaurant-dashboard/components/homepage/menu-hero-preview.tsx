import { getRestaurantInitials } from "@justsearch/utils";
import type { RestaurantTheme } from "@justsearch/utils";
import { Calendar, Bike } from "lucide-react";

interface MenuHeroPreviewProps {
  heroUrl: string;
  logoUrl: string;
  name: string;
  tagline: string;
  category: string;
  cuisine: string;
  hours: string;
  theme: RestaurantTheme;
}

export function MenuHeroPreview({ heroUrl, logoUrl, name, tagline, category, cuisine, hours, theme }: MenuHeroPreviewProps) {
  const initials = getRestaurantInitials(name);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
      <div className="relative h-48">
        {heroUrl ? (
          <img src={heroUrl} alt="Menu hero" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-slate-200" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <div className="mb-2 h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-xl" style={{ background: `linear-gradient(145deg, rgb(${theme.logoGradientFrom ?? "99,102,241"}), rgb(${theme.logoGradientTo ?? "168,85,247"}))` }}>
                {initials}
              </div>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">{category || "Category"}</p>
          <h3 className="text-2xl font-bold">{name || "Restaurant Name"}</h3>
          <p className="mt-1 text-sm text-white/80">{tagline || "Tagline"}</p>
        </div>
      </div>

      <div className="bg-white p-4 space-y-3">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5">
            <Bike className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Delivery Only</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 pr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Opening Today</p>
              <p className="text-xs font-bold text-slate-900">{hours || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {cuisine ? (
            cuisine.split(",").filter(Boolean).map((c, i) => (
              <span key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{c.trim()}</span>
            ))
          ) : (
            <span className="text-xs text-slate-300">No cuisine tags</span>
          )}
        </div>
      </div>
    </div>
  );
}
