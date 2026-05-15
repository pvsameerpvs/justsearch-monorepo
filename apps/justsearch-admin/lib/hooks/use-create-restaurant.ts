import { apiClient } from "@/lib/api-client";
import type { RestaurantFormData } from "@/components/restaurant/restaurant-create-schema";

export function useCreateRestaurant(refetch: () => void, onSuccess: () => void) {
  return async (data: RestaurantFormData) => {
    try {
      await apiClient("/restaurants", {
        method: "POST",
        body: JSON.stringify({
          slug: data.slug,
          subdomain: data.slug,
          name: data.name,
          ownerName: data.ownerName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          city: data.city,
          area: data.area,
          taxNumber: data.taxNumber,
          businessLicense: data.businessLicense,
          licenseUrl: data.licenseUrl,
          photos: data.photos,
          cuisine: data.cuisine,
          tables: data.tables,
          dashboardUsername: data.dashboardUsername,
          dashboardPassword: data.dashboardPassword,
        }),
      });
      refetch();
      onSuccess();
    } catch {
      alert("Failed to create restaurant");
    }
  };
}
