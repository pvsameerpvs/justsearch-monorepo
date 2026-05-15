import Image from 'next/image';
import Link from "next/link";
import { Store, ArrowUpRight } from "lucide-react";
import { getRestaurantInitials } from "@justsearch/utils";
import type { Restaurant } from "@justsearch/utils";

export function WelcomeBar({ restaurant }: { restaurant: Restaurant }) {
  const initials = getRestaurantInitials(restaurant.name);
  const t = restaurant.theme;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-slate-200">
        {restaurant.logoUrl ? (
          <Image src={restaurant.logoUrl} alt="" fill className="object-cover" sizes="48px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(145deg, rgb(${t.logoGradientFrom ?? "99,102,241"}), rgb(${t.logoGradientTo ?? "168,85,247"}))` }}>
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 truncate">{restaurant.name}</h1>
        <p className="text-sm text-slate-500 truncate">{restaurant.tagline}</p>
      </div>
      <Link href="/homepage" className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shrink-0">
        <Store className="h-4 w-4" /> Edit Site <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
