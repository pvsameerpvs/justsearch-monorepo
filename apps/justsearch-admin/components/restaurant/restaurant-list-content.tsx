"use client";

import { useMemo } from "react";
import { RestaurantRow } from "@/components/restaurant/restaurant-row";
import { RestaurantEmptyState } from "@/components/restaurant/restaurant-empty-state";
import { RestaurantSearchBar } from "@/components/restaurant/restaurant-search-bar";
import { mapApiToAdmin } from "./restaurant-list.utils";
import type { ApiRestaurant } from "@/lib/hooks/use-restaurants-query";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";

export function RestaurantListContent({
  restaurants,
  showForm,
  searchQuery,
  onSearchChange,
  onShowForm,
  onRequestDelete,
}: {
  restaurants: ApiRestaurant[];
  showForm: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onShowForm: () => void;
  onRequestDelete: (restaurant: AdminRestaurant) => void;
}) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    const q = searchQuery.toLowerCase();
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.subdomain.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q)
    );
  }, [restaurants, searchQuery]);

  return (
    <>
      {!showForm && restaurants.length > 0 && (
        <RestaurantSearchBar query={searchQuery} onQueryChange={onSearchChange} />
      )}

      <div className="space-y-3">
        {filtered.map((r) => {
          const adminR = mapApiToAdmin(r);
          return (
            <RestaurantRow
              key={r.id}
              restaurant={adminR}
              onRequestDelete={() => onRequestDelete(adminR)}
            />
          );
        })}
        {restaurants.length === 0 && !showForm && <RestaurantEmptyState onAdd={onShowForm} />}
        {filtered.length === 0 && restaurants.length > 0 && (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No restaurants match your search</p>
          </div>
        )}
      </div>
    </>
  );
}
