"use client";

import { LayoutGrid, List, UtensilsCrossed } from 'lucide-react';
import type { Restaurant } from '@/lib/restaurant-types';
import type { ViewMode } from './restaurant-menu-showcase';

type RestaurantMenuNavigationProps = {
  restaurant: Restaurant;
  availableItemsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export function RestaurantMenuNavigation({
  restaurant,
  availableItemsCount,
  viewMode,
  setViewMode,
}: RestaurantMenuNavigationProps) {
  return (
    <div className="sticky top-[calc(var(--restaurant-mobile-header-height,0px)+12px)] z-40 mb-16 rounded-[14px] border border-white/40 bg-white/70 p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all sm:p-3">
      <div className="flex flex-col gap-4 overflow-hidden rounded-[14px] bg-white/40 p-4 sm:p-5">
        
        {/* Header section with Stats and View Toggle */}
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] text-white shadow-lg shadow-[rgb(var(--brand)/0.2)]">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-[rgb(var(--ink))] sm:text-2xl">
                Menu Selection
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {availableItemsCount} Available dishes
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            {/* Layout Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100/80 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-white text-[rgb(var(--brand))] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-white text-[rgb(var(--brand))] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Categories Section */}
        <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {restaurant.menu.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="group relative flex shrink-0 items-center gap-3 rounded-[12px] border border-slate-200/50 bg-white px-6 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--brand))] hover:shadow-[0_8px_20px_-6px_rgba(var(--brand),0.15)] active:scale-95 sm:px-5 sm:py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 transition-colors group-hover:bg-[rgb(var(--brand)/0.1)]">
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">{category.emoji}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700 transition-colors group-hover:text-[rgb(var(--brand))] sm:text-sm sm:normal-case sm:tracking-normal">
                {category.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
