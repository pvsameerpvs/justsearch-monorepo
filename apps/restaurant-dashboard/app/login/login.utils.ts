import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

export function getSlugFromHostname(): string {
  if (typeof window === "undefined") return "mosaic-table";
  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") return "mosaic-table";
  if (host.startsWith("admin-")) return host.replace("admin-", "").split(".")[0];
  return host.split(".")[0];
}

const DEMO_RESTAURANTS: Record<string, { name: string; username: string; password: string }> = {
  "mosaic-table": { name: "Mosaic Table", username: "owner_mosaic", password: "owner123" },
  "spice-garden": { name: "Spice Garden", username: "owner_mosaic", password: "owner123" },
};

export function getRestaurantCreds(slug: string): { username: string; password: string; name: string } | null {
  try {
    const raw = localStorage.getItem("justsearch-admin-restaurants");
    if (raw) {
      const parsed = JSON.parse(raw);
      const restaurants = parsed.state?.restaurants ?? [];
      const found = restaurants.find((r: AdminRestaurant) => r.slug === slug || r.subdomain === slug);
      if (found && found.dashboardUsername && found.dashboardPassword) {
        return { username: found.dashboardUsername, password: found.dashboardPassword, name: found.name || "" };
      }
    }
  } catch {
    // ignore
  }
  return DEMO_RESTAURANTS[slug] ?? null;
}
