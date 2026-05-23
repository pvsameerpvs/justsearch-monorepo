import { Calendar, Globe, ExternalLink, ImageIcon } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";
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
  onRequestDelete: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function RestaurantDetailContent({
  restaurant,
  isEditing,
  form,
  onChange,
  onPhotosChange,
  onUpdate,
  onRequestDelete,
  onSave,
  onCancel,
}: RestaurantDetailContentProps) {
  const photos = (form.photos !== undefined ? form.photos : restaurant.photos) || [];

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-2 text-[10px] text-slate-400">
        <Calendar className="h-3 w-3" />
        <span>Created on {restaurant.createdAt}</span>
      </div>

      <div className="flex gap-2">
        <DomainLink label="Customer Site" url={`https://${restaurant.subdomain}.eatygo.com`} icon={Globe} />
        <DomainLink label="Dashboard" url={`https://${restaurant.subdomain}.admin.eatygo.com`} icon={ExternalLink} />
      </div>

      <RestaurantDetailForm restaurant={restaurant} isEditing={isEditing} form={form} onChange={onChange} />

      {isEditing && (
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

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
          onClick={onRequestDelete}
          className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
        >
          Delete Restaurant
        </button>
      </div>
    </div>
  );
}
