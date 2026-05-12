"use client";

import { Badge } from '@justsearch/ui';
import { ChevronRight, MapPin } from 'lucide-react';

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

const PLAN_CONFIG: Record<string, { label: string; variant: string }> = {
  exclusive: { label: 'Exclusive', variant: 'warning' },
  pool: { label: 'Pool', variant: 'secondary' },
};

const STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'success' },
  draft: { label: 'Draft', variant: 'secondary' },
};

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
          <div
            key={restaurant.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{restaurant.name}</span>
                <Badge variant={STATUS_CONFIG[restaurant.status].variant as never}>
                  {STATUS_CONFIG[restaurant.status].label}
                </Badge>
                <Badge variant={PLAN_CONFIG[restaurant.plan].variant as never}>
                  {PLAN_CONFIG[restaurant.plan].label}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {restaurant.city}
                </span>
                <span>{restaurant.orders.toLocaleString()} orders</span>
                <span>AED {restaurant.revenue.toLocaleString()} revenue</span>
                <span>{restaurant.customers.toLocaleString()} customers</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
