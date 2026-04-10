import type { Restaurant } from './restaurant-types';

const DEFAULT_PUBLIC_DOMAIN =
  process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN ?? 'justsearchrestorant.com';

export function getRestaurantDomain(restaurant: Restaurant): string {
  return `${restaurant.subdomain}.${DEFAULT_PUBLIC_DOMAIN}`;
}

export function getRestaurantInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
