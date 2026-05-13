const BASE_DOMAIN = "js-restorant.com";
const SEPARATOR = "--";

export interface DriverCredential {
  password: string;
  name: string;
  restaurantSlug: string;
}

export const VALID_CREDENTIALS: Record<string, DriverCredential> = {
  "aem-101": { password: "driver123", name: "Ahmed Hassan", restaurantSlug: "mosaic-table" },
  "moh-202": { password: "driver123", name: "Mohammed Ali", restaurantSlug: "mosaic-table" },
  "ras-303": { password: "driver123", name: "Rashid Khan", restaurantSlug: "mosaic-table" },
  "fah-404": { password: "driver123", name: "Fahad Ibrahim", restaurantSlug: "mosaic-table" },
  "sae-505": { password: "driver123", name: "Saeed Omar", restaurantSlug: "mosaic-table" },
};

export function extractDriverFromHostname(): {
  restaurantSlug: string | null;
  driverUniqueId: string | null;
} {
  if (typeof window === "undefined") {
    return { restaurantSlug: null, driverUniqueId: null };
  }

  const host = window.location.hostname.toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost")) {
    return { restaurantSlug: "mosaic-table", driverUniqueId: null };
  }

  if (!host.endsWith(`.${BASE_DOMAIN}`)) {
    return { restaurantSlug: null, driverUniqueId: null };
  }

  const fullSlug = host.replace(`.${BASE_DOMAIN}`, "");
  const sepIndex = fullSlug.indexOf(SEPARATOR);

  if (sepIndex <= 0) {
    return { restaurantSlug: fullSlug, driverUniqueId: null };
  }

  return {
    restaurantSlug: fullSlug.slice(0, sepIndex),
    driverUniqueId: fullSlug.slice(sepIndex + SEPARATOR.length),
  };
}
