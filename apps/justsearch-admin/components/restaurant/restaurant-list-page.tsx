"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@justsearch/ui";
import { useRestaurantsQuery } from "@/lib/hooks/use-restaurants-query";
import { RestaurantCreateForm } from "@/components/restaurant/restaurant-create-form";
import { useCreateRestaurant } from "@/lib/hooks/use-create-restaurant";
import { RestaurantStatsBar } from "@/components/restaurant/restaurant-stats-bar";
import { RestaurantListContent } from "./restaurant-list-content";
import { RestaurantLoading } from "./restaurant-loading";
import { mapApiToAdmin } from "./restaurant-list.utils";

export function RestaurantListPage() {
  const { restaurants, isLoading, error, refetch } = useRestaurantsQuery();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = useCreateRestaurant(refetch, () => setShowForm(false));

  if (isLoading) return <RestaurantLoading />;

  return (
    <div className="space-y-5">
      <PageHeader title="Restaurants" description="Manage all restaurants on the platform">
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors">
            <Plus className="h-4 w-4" /> Add Restaurant
          </button>
        )}
      </PageHeader>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error.message}</div>}

      <RestaurantStatsBar restaurants={restaurants.map(mapApiToAdmin)} />

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">Create New Restaurant</h3>
            <p className="text-sm text-slate-500">Fill in the details below to register a new restaurant.</p>
          </div>
          <RestaurantCreateForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <RestaurantListContent
        restaurants={restaurants}
        showForm={showForm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShowForm={() => setShowForm(true)}
      />
    </div>
  );
}
