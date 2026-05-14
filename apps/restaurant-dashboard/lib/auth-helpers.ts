import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

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

export function getAuthKey(slug: string): string {
  return "restaurant-dashboard-auth-" + slug;
}

const DEMO_CREDENTIALS: Record<string, { dashboardUsername: string; dashboardPassword: string }> = {
  "mosaic-table": { dashboardUsername: "js", dashboardPassword: "1234" },
  "spice-garden": { dashboardUsername: "js", dashboardPassword: "1234" },
};

export function getRestaurantBySlug(slug: string): { dashboardUsername: string; dashboardPassword: string } | null {
  try {
    const raw = localStorage.getItem("justsearch-admin-restaurants");
    if (raw) {
      const parsed = JSON.parse(raw);
      const restaurants = parsed.state?.restaurants ?? [];
      const found = restaurants.find((r: AdminRestaurant) => r.slug === slug || r.subdomain === slug);
      if (found && found.dashboardUsername && found.dashboardPassword) {
        return {
          dashboardUsername: found.dashboardUsername,
          dashboardPassword: found.dashboardPassword,
        };
      }
    }
  } catch {
    // ignore
  }

  return DEMO_CREDENTIALS[slug] ?? null;
}
