"use client";

import { RestaurantListItem } from './restaurant-list-item';

const RESTAURANTS = [
  {
    id: 1,
    name: 'Mosaic Table',
    slug: 'mosaic-table',
    status: 'active',
    plan: 'exclusive',
    city: 'Dubai',
    orders: 1240,
    revenue: 186000,
    customers: 456,
  },
  {
    id: 2,
    name: 'Spice Garden',
    slug: 'spice-garden',
    status: 'active',
    plan: 'pool',
    city: 'Dubai',
    orders: 890,
    revenue: 98000,
    customers: 312,
  },
  {
    id: 3,
    name: 'Burger Lab',
    slug: 'burger-lab',
    status: 'draft',
    plan: 'pool',
    city: 'Abu Dhabi',
    orders: 0,
    revenue: 0,
    customers: 0,
  },
];

export function RestaurantList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Restaurants</h3>
        <button
          type="button"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white"
        >
          Add Restaurant
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {RESTAURANTS.map((restaurant) => (
          <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
