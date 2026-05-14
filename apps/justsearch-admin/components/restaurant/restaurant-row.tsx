"use client";

import { useState } from "react";
import { Globe, Trash2, FileText, Briefcase, ExternalLink, ImageIcon, Calendar } from "lucide-react";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { RestaurantDetailDrawer } from "./restaurant-detail-drawer";

type Restaurant = ReturnType<typeof useRestaurantStore.getState>["restaurants"][number];

type RestaurantRowProps = {
  restaurant: Restaurant;
  onRemove: () => void;
};

export function RestaurantRow({ restaurant, onRemove }: RestaurantRowProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { updateRestaurant } = useRestaurantStore();

  const handleUpdate = (updates: Partial<Restaurant>) => {
    updateRestaurant(restaurant.id, updates);
  };

  const domains = [
    { label: "Customer Site", url: `${restaurant.subdomain}.js-restorant.com`, icon: Globe },
    { label: "Dashboard", url: `admin-${restaurant.subdomain}.js-restorant.com`, icon: Briefcase },
  ];

  const hasPhotos = restaurant.photos && restaurant.photos.length > 0;

  return (
    <>
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDetailOpen(true)}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {hasPhotos ? (
                <img src={restaurant.photos[0]} alt="" className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-lg font-bold text-slate-400">{restaurant.name.charAt(0)}</span>
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">{restaurant.name}</h3>
                  <StatusBadge status={restaurant.status} />
                  {restaurant.licenseUrl && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                      <FileText className="h-3 w-3" /> License
                    </span>
                  )}
                  {hasPhotos && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> {restaurant.photos.length} Photos
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {restaurant.city}, {restaurant.area} · {restaurant.cuisine} · {restaurant.tables} tables · 1 QR code
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-mono text-slate-400">{restaurant.subdomain}.js-restorant.com</p>
                  <span className="text-slate-300">·</span>
                  <p className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3" />
                    Created {restaurant.createdAt}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {domains.map((d) => (
              <a
                key={d.label}
                href={`https://${d.url}`}
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

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}


