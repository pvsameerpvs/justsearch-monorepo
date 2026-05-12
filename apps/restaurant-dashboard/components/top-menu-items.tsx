"use client";

import { Flame } from 'lucide-react';

const TOP_ITEMS = [
  { name: 'Whipped Hummus', orders: 42, image: '🥗' },
  { name: 'Citrus Grilled Salmon', orders: 38, image: '🐟' },
  { name: 'Charred Halloumi', orders: 35, image: '🧀' },
  { name: 'Date Cake', orders: 28, image: '🍰' },
];

export function TopMenuItems() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Top Menu Items</h3>
        <Flame className="h-5 w-5 text-orange-500" />
      </div>
      <div className="mt-4 space-y-3">
        {TOP_ITEMS.map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-xl">
              {item.image}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.orders} orders today</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
