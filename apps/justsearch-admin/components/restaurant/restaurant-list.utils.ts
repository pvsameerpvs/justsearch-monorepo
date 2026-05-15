import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

export function mapApiToAdmin(r: { id: string; slug: string; subdomain: string; name: string; status: string; createdAt: string }): AdminRestaurant {
  return {
    id: r.id,
    slug: r.slug,
    subdomain: r.subdomain,
    name: r.name,
    status: r.status as AdminRestaurant["status"],
    createdAt: r.createdAt,
    city: "",
    area: "",
    tables: 0,
    ownerName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    cuisine: "",
    taxNumber: "",
    businessLicense: "",
    licenseUrl: "",
    photos: [],
    dashboardUsername: "",
    dashboardPassword: "",
  };
}
