import { apiClient } from "@/lib/api-client";
import type { RestaurantStatus } from "@/lib/types/restaurant.types";

interface UpdateRestaurantPayload {
  name?: string;
  status?: RestaurantStatus;
  ownerName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  area?: string;
  cuisine?: string;
  tables?: number;
  taxNumber?: string;
  businessLicense?: string;
  licenseUrl?: string;
  photos?: string[];
  dashboardUsername?: string;
  dashboardPassword?: string;
}

export function useUpdateRestaurant(refetch: () => void) {
  return async (id: string, payload: UpdateRestaurantPayload) => {
    await apiClient(`/restaurants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    refetch();
  };
}
