import type { Restaurant } from '@justsearch/utils';
import { MapPin, Star, Phone } from 'lucide-react';

export function RestaurantHero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <img
          src={restaurant.heroImageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold text-amber-400 backdrop-blur-sm">
            {restaurant.category}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {restaurant.name}
          </h1>
          <p className="max-w-lg text-sm text-slate-300">
            {restaurant.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {restaurant.address}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {restaurant.overallRating} ({restaurant.totalReviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {restaurant.phone}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-white">{restaurant.cuisine.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Cuisines</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-white">{restaurant.totalReviews}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
