import type { AdminRestaurant, SocialLink } from "@/lib/types/admin-restaurant";
import { UAE_EMIRATES } from "@justsearch/types";
import type { DeliveryConfig, DeliveryTier, UaeEmirate } from "@justsearch/types";

function parseDelivery(raw: unknown): DeliveryConfig | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const tiers = Array.isArray(d.tiers)
    ? d.tiers.filter((t): t is DeliveryTier =>
        typeof t === "object" && t !== null &&
        typeof (t as Record<string, unknown>).minKm === "number" &&
        typeof (t as Record<string, unknown>).maxKm === "number" &&
        typeof (t as Record<string, unknown>).fee === "number"
      )
    : [];
  const emirates = Array.isArray(d.emirates)
    ? d.emirates.filter((e): e is UaeEmirate =>
        typeof e === "string" && (UAE_EMIRATES as readonly string[]).includes(e)
      )
    : (UAE_EMIRATES as UaeEmirate[]);
  if (!tiers.length && !d.enabled) return undefined;
  return {
    enabled: Boolean(d.enabled),
    maxRadiusKm: Number(d.maxRadiusKm ?? 0),
    restaurantLat: Number(d.restaurantLat ?? 0),
    restaurantLng: Number(d.restaurantLng ?? 0),
    emirates,
    tiers,
  };
}

function parseSocials(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
    .map((s) => ({
      platform: String(s.platform ?? ""),
      url: String(s.url ?? ""),
      handle: String(s.handle ?? ""),
    }));
}

export function mapApiToAdminRestaurant(apiData: Record<string, unknown>): AdminRestaurant {
  const s = (apiData.settings as Record<string, unknown> | null) ?? {};
  return {
    id: String(apiData.id ?? ""),
    name: String(apiData.name ?? ""),
    slug: String(apiData.slug ?? ""),
    subdomain: String(apiData.subdomain ?? ""),
    city: String(s.city ?? ""),
    area: String(s.area ?? ""),
    status: (apiData.status as AdminRestaurant["status"]) ?? "draft",
    createdAt: String(apiData.createdAt ?? new Date().toISOString()),
    tables: Number(s.tables ?? 0),
    ownerName: String(s.ownerName ?? ""),
    contactPhone: String(s.contactPhone ?? s.phone ?? ""),
    contactEmail: String(s.contactEmail ?? s.email ?? ""),
    address: String(s.address ?? ""),
    cuisine: String(s.cuisine ?? ""),
    taxNumber: String(s.taxNumber ?? ""),
    businessLicense: String(s.businessLicense ?? ""),
    licenseUrl: String(s.licenseUrl ?? ""),
    photos: Array.isArray(s.photos) ? s.photos.map(String) : [],
    dashboardUsername: String(s.dashboardUsername ?? ""),
    dashboardPassword: String(s.dashboardPassword ?? ""),
    website: String(s.website ?? ""),
    logoUrl: String(s.logoUrl ?? ""),
    heroImageUrl: String(s.heroImageUrl ?? ""),
    socials: parseSocials(s.socials),
    overallRating: Number(s.overallRating ?? 0),
    totalReviews: Number(s.totalReviews ?? 0),
    isPureVeg: typeof s.isPureVeg === 'boolean' ? s.isPureVeg : false,
    delivery: parseDelivery(s.delivery),
  };
}
