"use client";

import { useMemo } from "react";
import { RestaurantRow } from "@/components/restaurant/restaurant-row";
import { RestaurantEmptyState } from "@/components/restaurant/restaurant-empty-state";
import { RestaurantSearchBar } from "@/components/restaurant/restaurant-search-bar";
import { mapApiToAdmin } from "./restaurant-list.utils";

export function RestaurantListContent({
  restaurants,
  showForm,
  searchQuery,
  onSearchChange,
  onShowForm,
}: {
  restaurants: { id: string; slug: string; subdomain: string; name: string; status: string; createdAt: string }[];
  showForm: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onShowForm: () => void;
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
        {filtered.map((r) => (
          <RestaurantRow key={r.id} restaurant={mapApiToAdmin(r)} onRemove={() => {}} />
        ))}
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
