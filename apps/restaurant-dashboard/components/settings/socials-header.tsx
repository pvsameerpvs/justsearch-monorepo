import type { Restaurant } from "@justsearch/utils";

interface SocialsHeaderProps {
  restaurant: Restaurant;
}

export function SocialsHeader({ restaurant }: SocialsHeaderProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-center sm:p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Social media</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{restaurant.name}</h1>
      <p className="mt-3 text-sm font-medium text-slate-500">Follow the restaurant on your favorite channels.</p>
    </div>
  );
}
