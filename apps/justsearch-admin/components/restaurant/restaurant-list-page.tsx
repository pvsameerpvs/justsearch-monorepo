"use client";

import { useState } from "react";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { RestaurantCreateForm } from "@/components/restaurant/restaurant-create-form";
import { RestaurantRow } from "@/components/restaurant/restaurant-row";
import { PageHeader } from "@justsearch/ui";
import { Store } from "lucide-react";

export function RestaurantListPage() {
  const { restaurants, addRestaurant, removeRestaurant } = useRestaurantStore();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (data: { name: string; city: string; plan: "pool" | "exclusive"; tables: number }) => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    addRestaurant({
      name: data.name,
      slug,
      subdomain: slug,
      plan: data.plan,
      city: data.city,
      tables: data.tables,
      qrCount: data.tables + 1,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Restaurants" description="Manage all restaurants on the platform">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Close" : "+ Add Restaurant"}
        </button>
      </PageHeader>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Restaurant</h3>
          <RestaurantCreateForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {restaurants.map((r) => (
          <RestaurantRow key={r.id} restaurant={r} onRemove={() => removeRestaurant(r.id)} />
        ))}
        {restaurants.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Store className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">No restaurants yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
