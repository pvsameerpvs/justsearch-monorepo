"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { RestaurantCreateForm, type RestaurantFormData } from "@/components/restaurant/restaurant-create-form";
import { RestaurantRow } from "@/components/restaurant/restaurant-row";
import { RestaurantStatsBar } from "@/components/restaurant/restaurant-stats-bar";
import { RestaurantSearchBar } from "@/components/restaurant/restaurant-search-bar";
import { RestaurantEmptyState } from "@/components/restaurant/restaurant-empty-state";
import { PageHeader } from "@justsearch/ui";

export function RestaurantListPage() {
  const { restaurants, addRestaurant, removeRestaurant } = useRestaurantStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    const q = searchQuery.toLowerCase();
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.subdomain.toLowerCase().includes(q)
    );
  }, [restaurants, searchQuery]);

  const handleCreate = (data: RestaurantFormData) => {
    addRestaurant({
      name: data.name,
      slug: data.slug,
      subdomain: data.slug,
      city: data.city,
      area: data.area,
      tables: data.tables,
      ownerName: data.ownerName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      address: data.address,
      cuisine: data.cuisine,
      taxNumber: data.taxNumber,
      businessLicense: data.businessLicense,
      licenseUrl: data.licenseUrl,
      photos: data.photos || [],
      dashboardUsername: data.dashboardUsername,
      dashboardPassword: data.dashboardPassword,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Restaurants" description="Manage all restaurants on the platform">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Restaurant
          </button>
        )}
      </PageHeader>

      <RestaurantStatsBar restaurants={restaurants} />

      {!showForm && restaurants.length > 0 && (
        <RestaurantSearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">Create New Restaurant</h3>
            <p className="text-sm text-slate-500">Fill in the details below to register a new restaurant on the platform.</p>
          </div>
          <RestaurantCreateForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <RestaurantRow key={r.id} restaurant={r} onRemove={() => removeRestaurant(r.id)} />
        ))}
        {restaurants.length === 0 && !showForm && <RestaurantEmptyState onAdd={() => setShowForm(true)} />}
        {filtered.length === 0 && restaurants.length > 0 && (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No restaurants match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
