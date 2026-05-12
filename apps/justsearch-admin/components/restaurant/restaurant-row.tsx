"use client";

import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { Globe, Trash2 } from "lucide-react";

type Restaurant = ReturnType<typeof useRestaurantStore.getState>["restaurants"][number];

type RestaurantRowProps = {
  restaurant: Restaurant;
  onRemove: () => void;
};

export function RestaurantRow({ restaurant, onRemove }: RestaurantRowProps) {
  const domains = [
    { label: "Main", url: `${restaurant.subdomain}.js-restorant.com` },
    { label: "Menu", url: `${restaurant.subdomain}-menu.js-restorant.com` },
    { label: "Dashboard", url: `admin-${restaurant.subdomain}.js-restorant.com` },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900">{restaurant.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${restaurant.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {restaurant.status}
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{restaurant.plan}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{restaurant.city} · {restaurant.tables} tables · {restaurant.qrCount} QR</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {domains.map((d) => (
              <div key={d.label} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">{d.label}</p>
                  <p className="text-xs font-mono text-slate-600">{d.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
