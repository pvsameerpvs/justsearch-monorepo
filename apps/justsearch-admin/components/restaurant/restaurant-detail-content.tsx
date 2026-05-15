import { Calendar, Globe, ExternalLink, ImageIcon } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";
import { DomainLink } from "./restaurant-domain-link";
import { DashboardCredentialsCard } from "./restaurant-dashboard-credentials";
import { RestaurantDetailForm } from "./restaurant-detail-form";
import { RestaurantPhotoUpload } from "./restaurant-photo-upload";
import { RestaurantDetailQr } from "./restaurant-detail-qr";
import { RestaurantDetailLicense } from "./restaurant-detail-license";

interface RestaurantDetailContentProps {
  restaurant: AdminRestaurant;
  isEditing: boolean;
  form: Partial<AdminRestaurant>;
  onChange: (field: keyof AdminRestaurant, value: string | number) => void;
  onPhotosChange: (photos: string[]) => void;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
  onRemove: () => void;
}

export function RestaurantDetailContent({
  restaurant,
  isEditing,
  form,
  onChange,
  onPhotosChange,
  onUpdate,
  onRemove,
}: RestaurantDetailContentProps) {
  const photos = (form.photos !== undefined ? form.photos : restaurant.photos) || [];

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <Calendar className="h-3 w-3" />
        <span>Created on {restaurant.createdAt}</span>
      </div>

      <div className="flex gap-2">
        <DomainLink label="Customer Site" url={`https://${restaurant.subdomain}.js-restorant.com`} icon={Globe} />
        <DomainLink label="Dashboard" url={`https://admin-${restaurant.subdomain}.js-restorant.com`} icon={ExternalLink} />
      </div>

      <RestaurantDetailForm restaurant={restaurant} isEditing={isEditing} form={form} onChange={onChange} />

      <DashboardCredentialsCard restaurant={restaurant} />

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <ImageIcon className="h-4 w-4 text-rose-500" />
          Restaurant Photos
        </h3>
        <RestaurantPhotoUpload photos={photos} onChange={onPhotosChange} />
      </div>

      <RestaurantDetailQr subdomain={restaurant.subdomain} />

      <RestaurantDetailLicense
        restaurant={restaurant}
        isEditing={isEditing}
        form={form}
        onChange={onChange}
        onUpdate={onUpdate}
      />

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onRemove}
          className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
        >
          Delete Restaurant
        </button>
      </div>
    </div>
  );
}
