import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { RestaurantLogoBadge } from '@/components/restaurant/restaurant-logo-badge';
import type { Restaurant } from '@/lib/restaurant-types';

type Props = {
  restaurant: Restaurant;
};

export function ProfileOrderDetailsRestaurantLink({ restaurant }: Props) {
  return (
    <Link
      href="/menu"
      className="block rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm transition-colors hover:bg-white">
        <div className="flex items-center gap-3">
          <RestaurantLogoBadge
            restaurant={restaurant}
            size="sm"
            className="h-11"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
              Restaurant
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--ink))]">
              {restaurant.name}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
        </div>
      </Surface>
    </Link>
  );
}
