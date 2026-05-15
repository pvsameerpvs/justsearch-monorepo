"use client";

import { useState } from "react";
import { Globe, Briefcase, ExternalLink } from "lucide-react";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { RestaurantDetailDrawer } from "./restaurant-detail-drawer";
import { RestaurantRowInfo } from "./restaurant-row-info";
import { RestaurantRowActions } from "./restaurant-row-actions";

type Restaurant = ReturnType<typeof useRestaurantStore.getState>["restaurants"][number];

interface RestaurantRowProps {
  restaurant: Restaurant;
  onRemove: () => void;
}

export function RestaurantRow({ restaurant, onRemove }: RestaurantRowProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { updateRestaurant } = useRestaurantStore();

  const handleUpdate = (updates: Partial<Restaurant>) => {
    updateRestaurant(restaurant.id, updates);
  };

  const domains = [
    { label: "Customer Site", url: `https://${restaurant.subdomain}.js-restorant.com`, icon: Globe },
    { label: "Dashboard", url: `https://admin-${restaurant.subdomain}.js-restorant.com`, icon: Briefcase },
  ];

  return (
    <>
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDetailOpen(true)}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <RestaurantRowInfo restaurant={restaurant} />
            <RestaurantRowActions onRemove={onRemove} />
          </div>
          <div className="mt-3 flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {domains.map((d) => (
              <a
                key={d.label}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <d.icon className="h-3 w-3" />
                {d.label}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <RestaurantDetailDrawer
        restaurant={restaurant}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onUpdate={handleUpdate}
        onRemove={onRemove}
      />
    </>
  );
}
