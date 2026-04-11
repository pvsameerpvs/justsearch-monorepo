import { cn } from '@/lib/cn';
import { getRestaurantInitials } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';

type RestaurantLogoBadgeProps = {
  restaurant: Restaurant;
  size?: 'sm' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-14 w-14 rounded-[22px] text-base',
  lg: 'h-28 w-28 rounded-[32px] text-3xl',
} as const;

export function RestaurantLogoBadge({
  restaurant,
  size = 'sm',
  className,
}: RestaurantLogoBadgeProps) {
  const initials = getRestaurantInitials(restaurant.name);

  return (
    <div
      className={cn(
        'relative overflow-hidden border border-[rgb(var(--card-border)/0.9)] bg-[rgb(var(--card-surface)/0.96)] shadow-[0_18px_60px_rgba(15,23,42,0.15)] ring-1 ring-[rgb(var(--border)/0.28)]',
        sizeClasses[size],
        className
      )}
    >
      {restaurant.logoUrl ? (
        <img
          src={restaurant.logoUrl}
          alt={`${restaurant.name} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,rgb(var(--logo-from)),rgb(var(--logo-to)/0.92))] font-display font-semibold tracking-[-0.08em] text-white">
          {initials}
        </div>
      )}
    </div>
  );
}
