import Image from 'next/image';
import { FileText, ImageIcon, Calendar } from "lucide-react";
import { RestaurantRowStatus } from "./restaurant-row-status";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

interface RestaurantRowInfoProps {
  restaurant: AdminRestaurant;
}

export function RestaurantRowInfo({ restaurant }: RestaurantRowInfoProps) {
  const hasPhotos = restaurant.photos && restaurant.photos.length > 0;

  return (
    <div className="flex items-start gap-3 min-w-0">
      {hasPhotos ? (
        <Image src={restaurant.photos[0]} alt="" width={48} height={48} className="rounded-xl object-cover border border-slate-200 shrink-0" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
          <span className="text-lg font-bold text-slate-400">{restaurant.name.charAt(0)}</span>
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold text-slate-900">{restaurant.name}</h3>
          <RestaurantRowStatus status={restaurant.status} />
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
  );
}
