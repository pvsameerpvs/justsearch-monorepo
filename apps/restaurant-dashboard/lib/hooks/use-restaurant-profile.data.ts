import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

const STORAGE_KEY = "justsearch-admin-restaurants";

export function getSlugFromHostname(): string {
  if (typeof window === "undefined") return "mosaic-table";
  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") {
    return "mosaic-table";
  }
  if (host.startsWith("admin-")) {
    return host.replace("admin-", "").split(".")[0];
  }
  return host.split(".")[0];
}

export const DEMO_RESTAURANTS: AdminRestaurant[] = [
  {
    id: "1",
    name: "Mosaic Table",
    slug: "mosaic-table",
    subdomain: "mosaic-table",
    city: "Dubai",
    area: "Marina",
    status: "active",
    createdAt: "2024-01-15",
    tables: 10,
    ownerName: "Ahmed Al-Rashid",
    contactPhone: "+971 50 123 4567",
    contactEmail: "ahmed@mosaictable.ae",
    address: "Dubai Marina, Tower A, Floor 2",
    cuisine: "Mediterranean",
    taxNumber: "TRN-123456789",
    businessLicense: "BL-987654321",
    licenseUrl: "",
    photos: [],
    dashboardUsername: "js",
    dashboardPassword: "1234",
  },
];

export function loadRestaurants(): AdminRestaurant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_RESTAURANTS;
    const parsed = JSON.parse(raw);
    const list = parsed.state?.restaurants ?? [];
    return list.length > 0 ? list : DEMO_RESTAURANTS;
  } catch {
    return DEMO_RESTAURANTS;
  }
}

export function saveRestaurants(restaurants: AdminRestaurant[]) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  parsed.state.restaurants = restaurants;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}
