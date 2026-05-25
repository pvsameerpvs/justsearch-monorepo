import Image from 'next/image';
import { cn } from '@/lib/cn';
import { getRestaurantInitials } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';

type RestaurantLogoBadgeProps = {
  restaurant: Pick<Restaurant, 'name' | 'logoUrl'>;
  size?: 'sm' | 'lg';
  className?: string;
};

const heightClasses = {
  sm: 'h-14',
  lg: 'h-28',
} as const;

const fallbackSizeClasses = {
  sm: 'w-14 rounded-[22px] text-base',
  lg: 'w-28 rounded-[32px] text-3xl',
} as const;

const logoMaxWidthClasses = {
  sm: 'max-w-28',
  lg: 'max-w-52',
} as const;

export function RestaurantLogoBadge({
  restaurant,
  size = 'sm',
  className,
}: RestaurantLogoBadgeProps) {
  const initials = getRestaurantInitials(restaurant.name);
  const hasLogo = !!restaurant.logoUrl;

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
        heightClasses[size],
        !hasLogo &&
          'border border-[rgb(var(--card-border)/0.9)] bg-[rgb(var(--card-surface)/0.96)] shadow-[0_18px_60px_rgba(15,23,42,0.15)] ring-1 ring-[rgb(var(--border)/0.28)]',
        !hasLogo && fallbackSizeClasses[size],
        className,
        hasLogo && 'w-auto rounded-none border-0 shadow-none ring-0 bg-transparent',
        hasLogo && logoMaxWidthClasses[size]
      )}
    >
      {hasLogo ? (
        <Image
          src={restaurant.logoUrl!}
          alt={`${restaurant.name} logo`}
          width={400}
          height={400}
          priority
          className="h-full w-auto object-contain"
          style={{ width: 'auto', height: '100%' }}
          unoptimized={restaurant.logoUrl?.startsWith('http')}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,rgb(var(--logo-from)),rgb(var(--logo-to)/0.92))] font-display font-semibold tracking-[-0.08em] text-white">
          {initials}
        </div>
      )}
    </div>
  );
}
