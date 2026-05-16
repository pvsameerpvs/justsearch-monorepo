import type { AdminRestaurant } from "@/lib/types/restaurant.types";
import type { ApiRestaurant } from "@/lib/hooks/use-restaurants-query";

export function mapApiToAdmin(r: ApiRestaurant): AdminRestaurant {
  return {
    id: r.id,
    slug: r.slug,
    subdomain: r.subdomain,
    name: r.name,
    status: r.status as AdminRestaurant['status'],
    createdAt: r.createdAt,
    city: r.city ?? '',
    area: r.area ?? '',
    tables: r.tables ?? 0,
    ownerName: r.ownerName ?? '',
    contactPhone: r.contactPhone ?? '',
    contactEmail: r.contactEmail ?? '',
    address: r.address ?? '',
    cuisine: r.cuisine ?? '',
    taxNumber: r.taxNumber ?? '',
    businessLicense: r.businessLicense ?? '',
    licenseUrl: r.licenseUrl ?? '',
    photos: r.photos ?? [],
    dashboardUsername: r.dashboardUsername ?? '',
    dashboardPassword: r.dashboardPassword ?? '',
  };
}
