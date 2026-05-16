"use client";

import { LayoutGrid, Leaf, Beef } from 'lucide-react';
import type { Restaurant } from '@/lib/restaurant-types';
import type { ViewMode, DietaryFilter } from './use-menu-showcase-state';
import { ViewModeToggle } from './view-mode-toggle';
import { CategoryScrollList } from './category-scroll-list';

interface RestaurantMenuNavigationProps {
  restaurant: Restaurant;
  availableItemsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  dietaryFilter: DietaryFilter;
  setDietaryFilter: (filter: DietaryFilter) => void;
}

export function RestaurantMenuNavigation({
  restaurant,
  availableItemsCount,
  viewMode,
  setViewMode,
  dietaryFilter,
  setDietaryFilter,
}: RestaurantMenuNavigationProps) {
  return (
    <div className="sticky top-[calc(var(--restaurant-mobile-header-height,0px)+12px)] z-40 mb-16 rounded-[14px] border border-white/40 bg-white/70 p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all sm:p-3">
      <div className="flex flex-col gap-4 overflow-hidden rounded-[14px] bg-white/40 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-[rgb(var(--ink))] sm:text-2xl">Menu Selection</h2>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{availableItemsCount} Available dishes</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {!restaurant.isPureVeg && (
          <div className="flex items-center gap-2">
            <DietaryPill filter="all" active={dietaryFilter} onClick={setDietaryFilter} />
            <DietaryPill filter="veg" active={dietaryFilter} onClick={setDietaryFilter} />
            <DietaryPill filter="nonVeg" active={dietaryFilter} onClick={setDietaryFilter} />
          </div>
        )}

        {restaurant.isPureVeg && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Leaf className="h-3.5 w-3.5" />
              Pure Veg Restaurant
            </span>
          </div>
        )}

        <CategoryScrollList categories={restaurant.menu} />
      </div>
    </div>
  );
}

function DietaryPill({
  filter,
  active,
  onClick,
}: {
  filter: DietaryFilter;
  active: DietaryFilter;
  onClick: (f: DietaryFilter) => void;
}) {
  const isActive = active === filter;
  const label = filter === 'all' ? 'All' : filter === 'veg' ? 'Veg' : 'Non-Veg';
  const icon = filter === 'veg' ? <Leaf className="h-3.5 w-3.5" /> : filter === 'nonVeg' ? <Beef className="h-3.5 w-3.5" /> : null;

  return (
    <button
      onClick={() => onClick(filter)}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        isActive
          ? 'bg-slate-900 text-white'
          : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
