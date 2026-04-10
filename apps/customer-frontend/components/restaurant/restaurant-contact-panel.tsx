import { MapPin, PhoneCall } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';

type RestaurantContactPanelProps = {
  restaurant: Restaurant;
};

export function RestaurantContactPanel({
  restaurant,
}: RestaurantContactPanelProps) {
  return (
    <Surface className="rounded-[32px] border-white/70 bg-white/88 p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 h-5 w-5 text-[rgb(var(--brand))]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
            Contact details
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {restaurant.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
            {restaurant.address}
            <br />
            {restaurant.city}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
            <PhoneCall className="h-4 w-4 text-[rgb(var(--brand))]" />
            {restaurant.phone}
          </p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            {restaurant.email}
          </p>
        </div>
      </div>
    </Surface>
  );
}
