"use client";

import { Store, Plus } from "lucide-react";

interface RestaurantEmptyStateProps {
  onAdd: () => void;
}

export function RestaurantEmptyState({ onAdd }: RestaurantEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 mb-4">
        <Store className="h-8 w-8 text-slate-300" />
      </div>
      <h3 className="text-base font-bold text-slate-900">No restaurants yet</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-xs">
        Create your first restaurant to start managing menus, orders, and analytics.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
      >
        <Plus className="h-4 w-4" /> Add Restaurant
      </button>
    </div>
  );
}
