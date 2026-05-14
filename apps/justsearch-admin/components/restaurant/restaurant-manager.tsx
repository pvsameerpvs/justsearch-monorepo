"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useRestaurantStore } from '@/lib/stores/restaurant-store';
import { RestaurantCreateForm, type RestaurantFormData } from './restaurant-create-form';

export function RestaurantManager() {
  const [showForm, setShowForm] = useState(false);
  const { restaurants, addRestaurant } = useRestaurantStore();

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

  if (showForm) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Create New Restaurant</h3>
        <div className="mt-4">
          <RestaurantCreateForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Restaurants</h3>
        <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600">
          + Add Restaurant
        </Button>
      </div>

      <div className="space-y-3">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-bold text-slate-900">{restaurant.name}</p>
              <p className="text-xs text-slate-500">
                {restaurant.subdomain}.js-restorant.com · {restaurant.city}
              </p>
              <div className="mt-1 flex gap-2">
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                  {restaurant.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{restaurant.tables} tables</p>
              <p className="text-xs text-slate-400">1 QR code</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
